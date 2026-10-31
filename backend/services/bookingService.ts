import { inject, injectable } from "inversify";
import { UpdateQuery } from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import {
  CancelBookingBody,
  CancelBookingRequestDTO,
  CreateBookingBody,
  CreateBookingRequestDTO,
  GetOperatorBookingsQuery,
  OperatorCancelBookingBody,
  ProcessAdminCancellationBody,
  toOperatorReschuduleBookingBody,
  toVerifyCancellationBody,
  UpdateAttendanceBody,
  VerifyBookingPaymentBody,
  VerifyPaymentRequestDTO,
} from "../dto-mapping/dto/booking/bookingRequestDTO";
import { OperatorBookingListResponseDTO } from "../dto-mapping/dto/booking/bookingResponseDTO";
import { BookingRequestMapper } from "../dto-mapping/mapper/booking/BookingRequestMapper";
import { BookingResponseMapper } from "../dto-mapping/mapper/booking/BookingResponseMapper";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import { IOperatorBookingFilter } from "../interfaces/IBooking";
import { IBookingPricing } from "../interfaces/IBookingPricing";
import type { IBookingRepository } from "../interfaces/IBookingRepository";
import { IBookingService } from "../interfaces/IBookingService";
import type { ICouponRepository } from "../interfaces/ICouponRepository";
import type { IMailService } from "../interfaces/IMailService";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { IPaymentService } from "../interfaces/IPaymentService";
import type { IPayoutRepository } from "../interfaces/IPayoutRepository";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IWalletRepository } from "../interfaces/IWalletRepository";
import { IBookingDocument } from "../models/Booking";
import { CouponType, ICouponDocument } from "../models/Coupon";
import { Types } from "../types/types";
import { bookingConfirmationMessage } from "../utils/bookingConfirmationMessage";
import { CustomError } from "../utils/customError";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(Types.UserRepository) private _userRepository: IUserRepository,

    @inject(Types.PackageRepository)
    private _packageRepository: IPackageRepository,

    @inject(Types.BookingRepository)
    private _bookingRepository: IBookingRepository,
    @inject(Types.WalletRepository)
    private _walletRepository: IWalletRepository,
    @inject(Types.CouponRepository)
    private _couponRepository: ICouponRepository,

    @inject(Types.MailService) private _mailService: IMailService,

    @inject(Types.PaymentService) private _paymentService: IPaymentService,
    @inject(Types.PayoutRepository)
    private _payoutRepository: IPayoutRepository,
  ) {}

  async processAdminCancellation(
    body: ProcessAdminCancellationBody,
    bookingId: string,
  ) {
    const dto = BookingRequestMapper.toProcessAdminCancellationDTO(body);
    const { approve, adminNotes } = dto;
    const booking = await this._bookingRepository.findByBookingId(bookingId);
    if (!booking || booking.status !== "CANCEL_REQUESTED") {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.CANCEL_REQ_NOT_FOUND,
        StatusCode.BAD_REQUEST,
      );
    }
    const now = new Date();
    if (approve) {
      const refundAmound = booking.cancellation?.refundAmount || 0;
      await this._walletRepository.addCreditTransaction(
        booking.userId.toString(),
        {
          transactionId: `REFUND_${Date.now()}`,
          type: "CREDIT",
          purpose: "REFUND",
          amount: refundAmound,
          status: "SUCCESS",
          description: `50% refund approved for cancelled tour: ${booking.packageId.name}`,
        },
      );
      const updatedBooking = await this._bookingRepository.updateById(
        bookingId,
        {
          status: "CANCELLED",
          "cancellation.processedAt": now,
          "cancellation.adminNotes": adminNotes || "Approved by admin",
        } as UpdateQuery<IBookingDocument>,
      );
      return BookingResponseMapper.toBookingDTO(updatedBooking);
    } else {
      const updatedBooking = await this._bookingRepository.updateById(
        bookingId,
        {
          status: "CONFIRMED",
          "cancellation.adminNotes": adminNotes || "Rejected by Admin",
        } as UpdateQuery<IBookingDocument>,
      );
      return BookingResponseMapper.toBookingDTO(updatedBooking);
    }
  }

  async getPendingCancelationRequests() {
    const requests =
      await this._bookingRepository.getPendingCancellationRequests();
    return BookingResponseMapper.toPendingCancellationListDTO(requests);
  }

  async getOperatorBookingsService(
    operatorId: string,
    query: GetOperatorBookingsQuery,
  ): Promise<OperatorBookingListResponseDTO> {
    const queryDTO = BookingRequestMapper.toGetOperatorBookingsQueryDTO(query);
    const { status, skip, limit } = queryDTO;
    const filter: IOperatorBookingFilter = {
      operatorId,
      ...(status && { status }),
    };
    const [bookings, totalCount] = await Promise.all([
      this._bookingRepository.getOperatorBookings(filter, skip, limit),
      this._bookingRepository.getOperatorBookingsCount(filter),
    ]);
    const currentPage = Math.floor(skip / limit) + 1;
    return BookingResponseMapper.toOperatorBookingListResponseDTO(
      { bookings, totalCount },
      currentPage,
      limit,
    );
  }

  async getOperatorBookingDetailsService(
    bookingId: string,
    operatorId: string,
  ) {
    const booking = await this._bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    return BookingResponseMapper.toBookingDTO(booking);
  }

  async operatorCancelBookingService(
    bookingId: string,
    operatorId: string,
    body: OperatorCancelBookingBody,
  ) {
    const dto = BookingRequestMapper.toOperatorCancelBookingDTO(body);

    const { reason } = dto;
    if (!reason || reason.trim() === "") {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.CANCEL_REASON_MISSING,
      );
    }
    const booking = await this._bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    const totalPaid =
      (booking.pricing.walletApplied ?? 0) + (booking.pricing.finalAmount ?? 0);
    await this._walletRepository.addCreditTransaction(
      booking.userId._id.toString(),
      {
        transactionId: `REFUND_OPERATOR_${Date.now()}`,
        type: "CREDIT",
        purpose: "REFUND",
        amount: totalPaid,
        status: "SUCCESS",
        description: `Full refund (Operator cancelled tour): ${reason}`,
      },
    );

    const updatedBooking = await this._bookingRepository.updateById(bookingId, {
      status: "CANCELLED",
      "cancellation.requestedAt": new Date(),
      "cancellation.processedAt": new Date(),
      "cancellation.refundAmount": totalPaid,
      "cancellation.reason": `Operator Cancelled: ${reason}`,
    } as UpdateQuery<IBookingDocument>);

    return BookingResponseMapper.toBookingDTO(updatedBooking);
  }

  async operatorRescheduleBookingService(
    bookingId: string,
    operatorId: string,
    body: toOperatorReschuduleBookingBody,
  ) {
    if (!body.startDate) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.START_DATE_MISSING,
        StatusCode.BAD_REQUEST,
      );
    }
    const dto = BookingRequestMapper.toOperatorReschuduleBookingDTO(body);
    const { startDate } = dto;
    const booking = await this._bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    const udpatedPackage = await this._packageRepository.updatePackageById(
      booking.packageId._id.toString(),
      {
        startDate,
      },
    );
    return PackageResponseMapper.toPackageResponseDTO(udpatedPackage);
  }

  async updateAttendanceService(
    operatorId: string,
    bookingId: string,
    body: UpdateAttendanceBody,
  ) {
    const dto = BookingRequestMapper.toUpdateAttendanceDTO(body);
    const { attendance } = dto;
    const booking = await this._bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (booking.status !== "CONFIRMED") {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.ATTENDANCE_CHANGE_FOR_NOT_CONFIRMED,
        StatusCode.BAD_REQUEST,
      );
    }
    const updateData: Record<string, any> = { attendance };
    if (attendance === "CHECKED_IN" || attendance === "COMPLETED") {
      updateData.checkInTime = new Date();
    }
    const updatedBooking = await this._bookingRepository.updateById(
      bookingId,
      updateData,
    );
    return BookingResponseMapper.toBookingDTO(updatedBooking);
  }
  async verifyCancellationService(
    bookingId: string,
    operatorId: string,
    body: toVerifyCancellationBody,
  ) {
    const dto = BookingRequestMapper.toVerifyCancellationDTO(body);
    const { action, operatorNotes } = dto;
    const booking = await this._bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (booking.status !== "CANCEL_REQUESTED") {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_CANCEL_REQUESTED_STATUS,
        StatusCode.BAD_REQUEST,
      );
    }
    if (action === "APPROVE") {
      const totalPaid =
        (booking.pricing.walletApplied ?? 0) +
        (booking.pricing.finalAmount ?? 0);
      const refundAmount = Math.round(totalPaid * 0.5);
      await this._walletRepository.addCreditTransaction(
        booking.userId._id.toString(),
        {
          transactionId: `REFUND_50_OPERATOR_${Date.now()}`,
          type: "CREDIT",
          purpose: "REFUND",
          amount: refundAmount,
          status: "SUCCESS",
          description: `50% Partial refund Approved: ${booking.cancellation.reason || "Guest requested cancellation"}`,
        },
      );

      const updatedBooking = await this._bookingRepository.updateById(
        bookingId,
        {
          status: "CANCELLED",
          "cancellation.processedAt": new Date(),
          "cancellation.refundAmount": refundAmount,
          "cancellation.reason": `Approved by Operator: ${operatorNotes || "50% refund issued"}`,
        } as UpdateQuery<IBookingDocument>,
      );
      return BookingResponseMapper.toBookingDTO(updatedBooking);
    } else {
      const updatedBooking = await this._bookingRepository.updateById(
        bookingId,
        {
          status: "CONFIRMED",
          "cancellation.processedAt": Date.now(),
          "cancellation.reason": `Rejected by Operator: ${operatorNotes || "Request denied."}`,
        } as UpdateQuery<IBookingDocument>,
      );
      return BookingResponseMapper.toBookingDTO(updatedBooking);
    }
  }
  async createBookingOrder(userId: string, body: CreateBookingBody) {
    const dto = BookingRequestMapper.toCreateBookingDTO(body);
    const {
      addedActivityIds = [],
      packageId,
      removedActivityIds = [],
      generalCouponCode,
      bankCouponCode,
      isWalletApplied,
      adultCount = 1,
      childCount = 0,
      primaryContact,
      members = [],
    } = dto;

    const pkg = await this._packageRepository.getPackageById(packageId);
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    let addedActivitiesAmount = 0;
    for (const day of pkg.itinerary) {
      for (const activity of day.optionalActivities) {
        if (addedActivityIds.includes(activity.id)) {
          addedActivitiesAmount += activity.cost;
        }
      }
    }

    let removedActivitiesAmount = 0;
    for (const day of pkg.itinerary) {
      for (const activity of day.activities) {
        if (
          activity.customizable &&
          dto.removedActivityIds.includes(activity.id)
        ) {
          removedActivitiesAmount += activity.cost;
        }
      }
    }

    const baseAmount = pkg.amount;
    const singleAdultSubtotal = Math.max(
      0,
      baseAmount + addedActivitiesAmount - removedActivitiesAmount,
    );

    let generalCoupon: ICouponDocument | null = null;
    let bankCoupon: ICouponDocument | null = null;
    let singleAdultGeneralDiscount = 0;
    let singleAdultBankDiscount = 0;
    let singleAdultRunning = singleAdultSubtotal;
    if (generalCouponCode?.trim()) {
      generalCoupon = await this._couponRepository.findByCode(
        generalCouponCode?.trim(),
      );
      if (!generalCoupon) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.INVALID_CODE,
          StatusCode.BAD_REQUEST,
        );
      }
      if (generalCoupon.type !== CouponType.GENERAL) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.INVALID_CODE,
          StatusCode.BAD_REQUEST,
        );
      }

      if (
        generalCoupon?.minBookingAmount &&
        singleAdultSubtotal < generalCoupon.minBookingAmount
      ) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.MINIMUM_AMOUNT(
            generalCoupon.minBookingAmount,
          ),
          StatusCode.BAD_REQUEST,
        );
      }

      if (generalCoupon.discountType === "PERCENTAGE") {
        singleAdultGeneralDiscount =
          (singleAdultSubtotal * generalCoupon.discountValue) / 100;
        if (
          generalCoupon.maxDiscountAmount &&
          singleAdultGeneralDiscount > generalCoupon.maxDiscountAmount
        ) {
          singleAdultGeneralDiscount = generalCoupon.maxDiscountAmount;
        }
      } else {
        singleAdultGeneralDiscount = generalCoupon.discountValue;
      }
      singleAdultRunning -= singleAdultGeneralDiscount;
    }

    if (bankCouponCode?.trim()) {
      bankCoupon = await this._couponRepository.findByCode(
        bankCouponCode.trim(),
      );
      if (!bankCoupon) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.INVALID_CODE,
          StatusCode.BAD_REQUEST,
        );
      }
      if (bankCoupon.type !== CouponType.BANK) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.INVALID_CODE,
          StatusCode.BAD_REQUEST,
        );
      }
      if (
        bankCoupon.minBookingAmount &&
        singleAdultSubtotal < bankCoupon.minBookingAmount
      ) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.MINIMUM_AMOUNT(
            bankCoupon.minBookingAmount,
          ),
          StatusCode.BAD_REQUEST,
        );
      }

      if (bankCoupon.discountType === "PERCENTAGE") {
        singleAdultBankDiscount =
          (singleAdultRunning * bankCoupon.discountValue) / 100;
        if (
          bankCoupon.maxDiscountAmount &&
          singleAdultBankDiscount > bankCoupon.maxDiscountAmount
        ) {
          singleAdultBankDiscount = bankCoupon.maxDiscountAmount;
        }
      } else {
        singleAdultBankDiscount = bankCoupon.discountValue;
      }
      singleAdultRunning -= singleAdultBankDiscount;
    }

    const singleAdultTotalDiscount =
      singleAdultGeneralDiscount + singleAdultBankDiscount;

    const singleAdultPayable = Math.max(0, singleAdultRunning);
    let childUnitPrice = singleAdultPayable;
    let childPercentage = 1;
    if (childCount > 0 && pkg?.childPricing?.enabled) {
      childPercentage = (pkg.childPricing.percentage ?? 100) / 100;
      childUnitPrice = Math.round(singleAdultPayable * childPercentage);
    }

    const totalAdultAmount = singleAdultPayable * adultCount;
    const totalChildAmount = childUnitPrice * childCount;
    const grandSubtotal = totalAdultAmount + totalChildAmount;

    const singleChildTotalDiscount = singleAdultTotalDiscount * childPercentage;
    const totalDiscountApplied =
      singleAdultTotalDiscount * adultCount +
      singleChildTotalDiscount * childCount;

    let walletDeduction = 0;
    let remainingPayable = grandSubtotal;
    if (isWalletApplied) {
      const wallet = await this._walletRepository.findOne({ userId });
      if (wallet && wallet?.balance > 0) {
        walletDeduction = Math.min(wallet?.balance, grandSubtotal);
        remainingPayable = grandSubtotal - walletDeduction;
      }
    }

    const pricing: IBookingPricing = {
      adultCount,
      childCount,
      adultUnitPrice: singleAdultPayable,
      childUnitPrice,
      adultAmount: totalAdultAmount,
      childAmount: totalChildAmount,
      baseAmount,
      addedActivitiesAmount,
      removedActivitiesAmount,
      subtotal: grandSubtotal,
      ...(generalCoupon && {
        generalCoupon: {
          couponId: generalCoupon._id.toString(),
          code: generalCoupon.code,
          title: generalCoupon.title,
          type: generalCoupon.type,
          discountAmount: singleAdultGeneralDiscount,
        },
      }),
      ...(bankCoupon && {
        bankCoupon: {
          couponId: bankCoupon._id.toString(),
          code: bankCoupon.code,
          title: bankCoupon.title,
          type: bankCoupon.type,
          discountAmount: singleAdultBankDiscount,
        },
      }),
      totalDiscount: totalDiscountApplied,
      walletApplied: walletDeduction,
      finalAmount: remainingPayable,
    };

    if (remainingPayable === 0) {
      const internalOrderId = `ORDER_WALLET_${Date.now()}`;
      const updatedWallet = await this._walletRepository.deductBalance(
        userId,
        walletDeduction,
        {
          transactionId: `TXN_${Date.now()}`,
          type: "DEBIT",
          purpose: "BOOKING_PAYMENT",
          amount: walletDeduction,
          status: "SUCCESS",
          description: `Payment for tour: ${pkg.name}`,
        },
      );
      if (!updatedWallet) {
        throw new CustomError(
          RESPONSE_MESSAGES.WALLET.ERROR.TRANSACTION_FAILED,
          StatusCode.BAD_REQUEST,
        );
      }

      const booking = await this._bookingRepository.createBooking({
        userId,
        packageId,
        razorpayOrderId: internalOrderId,
        pricing,

        addedActivityIds,
        removedActivityIds,
        primaryContact,
        members,
        status: "CONFIRMED",
      });

      const commissionRate = 5;
      const grossAmount = grandSubtotal;
      const platformCommissionAmount = (grossAmount * commissionRate) / 100;
      const netPayoutAmount = grossAmount - platformCommissionAmount;
      await this._payoutRepository.create({
        bookingId: booking._id,
        operatorId: pkg.operatorId,
        packageId,
        grossAmount,
        platformCommissionRate: commissionRate,
        platformCommissionAmount,
        netPayoutAmount,
        payoutStatus: "PENDING",
      });

      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new CustomError(
          RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }

      await this._mailService.sendEmail(
        user?.email,
        "Tour booking confirmed",
        bookingConfirmationMessage({
          userName: user?.name,
          amount: booking.pricing.walletApplied,
          bookingId: booking._id as string,
          packageName: pkg.name,
        }),
      );
      const result = {
        isFullyPaidByWallet: true,
        bookingId: booking._id,
        orderId: internalOrderId,
      };
      return BookingResponseMapper.toCreateBookingOrderResposeDTO(result);
    }

    const order = await this._paymentService.createOrder({
      amount: remainingPayable,
      receipt: `receipt_pkg_${Date.now()}`,
      ...(bankCoupon && {
        offerId: bankCoupon?.razorpayOfferId,
      }),
      notes: {
        userId,
        packageId,
        generalCouponCode: generalCouponCode || "",
        bankCouponCode: bankCouponCode || "",
        addedActivityIds: JSON.stringify(addedActivityIds),
        removedActivityIds: JSON.stringify(removedActivityIds),
      },
    });
    if (!order)
      throw new CustomError(
        RESPONSE_MESSAGES.PAYMENT.ERROR.INITIATE,
        StatusCode.INTERNAL_SERVER_ERROR,
      );

    const booking = await this._bookingRepository.createBooking({
      userId,
      packageId,
      razorpayOrderId: order.id,
      pricing,
      members,
      primaryContact,
      addedActivityIds,
      removedActivityIds,
      status: "PENDING",
    });

    const commissionRate = 5;
    const grossAmount = grandSubtotal;
    const platformCommissionAmount = (grossAmount * commissionRate) / 100;
    const netPayoutAmount = grossAmount - platformCommissionAmount;
    await this._payoutRepository.create({
      bookingId: booking._id,
      operatorId: pkg.operatorId,
      packageId,
      grossAmount,
      platformCommissionRate: commissionRate,
      platformCommissionAmount,
      netPayoutAmount,
      payoutStatus: "PENDING",
    });

    const result = {
      isFullyPaidByWallet: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      packageName: pkg.name,
      packageDescription: `${pkg.duration.day}D / ${pkg.duration.night}N Tour Package`,
      offerId: bankCoupon?.razorpayOfferId || null,
    };

    return BookingResponseMapper.toCreateBookingOrderResposeDTO(result);
  }

  async verifyAndConfirmBooking(
    userId: string,
    body: VerifyBookingPaymentBody,
  ) {
    const dto = BookingRequestMapper.toVerifyPaymentDTO(body);

    const isValid = this._paymentService.verifySignature({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      await this._bookingRepository.updateStatusByOrderId(dto.razorpayOrderId, {
        status: "FAILED",
      });
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_SIGNATURE,
        StatusCode.BAD_REQUEST,
      );
    }

    const booking = await this._bookingRepository.findByOrderId(
      dto.razorpayOrderId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (booking.pricing.walletApplied && booking.pricing.walletApplied > 0) {
      await this._walletRepository.deductBalance(
        userId,
        booking.pricing.walletApplied,
        {
          transactionId: `TXN_${Date.now()}`,
          type: "DEBIT",
          purpose: "BOOKING_PAYMENT",
          amount: booking.pricing.walletApplied,
          status: "SUCCESS",
          description: `Partial wallet payment for booking order: ${dto.razorpayOrderId}`,
        },
      );
    }

    const updatedBooking = await this._bookingRepository.updateStatusByOrderId(
      dto.razorpayOrderId,
      {
        status: "CONFIRMED",
        razorpayPaymentId: dto.razorpayPaymentId,
      },
    );
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    const pkg = await this._packageRepository.findById(dto.packageId);
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    await this._mailService.sendEmail(
      user?.email,
      "Tour booking confirmed",
      bookingConfirmationMessage({
        userName: user?.name,
        amount:
          (updatedBooking?.pricing.walletApplied ?? 0) +
          (updatedBooking?.pricing.finalAmount ?? 0),
        bookingId: updatedBooking?._id as string,
        packageName: pkg.name,
      }),
    );

    return BookingResponseMapper.toVerifyPayementResponseDTO(updatedBooking);
  }

  async findBookingByOrderId(razorpayOrderId: string) {
    const booking =
      await this._bookingRepository.findByOrderId(razorpayOrderId);
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_ORDER_ID,
        StatusCode.BAD_REQUEST,
      );
    }
    return BookingResponseMapper.toBookingDTO(booking);
  }

  async getUserBookings(userId: string, page: number = 1, limit: number = 5) {
    if (!userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.USER_ID_MISSING,
        StatusCode.BAD_REQUEST,
      );
    }
    const skip = (page - 1) * limit;
    const result = await this._bookingRepository.getUserBookings(
      userId,
      skip,
      limit,
    );
    return {
      bookings: BookingResponseMapper.toBookingListDTO(result.bookings),
      totalCount: result.totalCount,
    };
  }
  async cancelBooking(
    userId: string,
    bookingId: string,
    body: CancelBookingBody,
  ) {
    const dto = BookingRequestMapper.toCancelBookingDTO(body);
    const { reason } = dto;
    const booking = await this._bookingRepository.findByBookingId(bookingId);
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (booking.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.AUTH.ERROR.ACCESS_DENIED,
        StatusCode.FORBIDDEN,
      );
    }
    if (booking.status !== "CONFIRMED") {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.CANCEL_NOT_CONFIRM_STATUS,
        StatusCode.BAD_REQUEST,
      );
    }
    const tourStartDate = booking.packageId.startDate;
    const now = new Date();
    const diffInTime = tourStartDate.getTime() - now.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    if (diffInDays <= 0) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.CANCEL_AFTER_START_DATE,
        StatusCode.BAD_REQUEST,
      );
    }
    const totalPaid =
      (booking.pricing.walletApplied ?? 0) + (booking.pricing.finalAmount ?? 0);
    if (diffInDays > 7) {
      const refundAmount = totalPaid;
      await this._walletRepository.addCreditTransaction(userId, {
        transactionId: `REFUND_${Date.now()}`,
        type: "CREDIT",
        purpose: "REFUND",
        amount: refundAmount,
        status: "SUCCESS",
        description: `Full refund for cancelled tour: ${booking.packageId.name}`,
      });

      const updatedBooking = await this._bookingRepository.updateById(
        bookingId,
        {
          status: "CANCELLED",
          "cancellation.requestedAt": now,
          "cancellation.processedAt": now,
          "cancellation.refundAmount": refundAmount,
          "cancellation.reason": reason || "User cancelled (>7 days prior)",
        } as UpdateQuery<IBookingDocument>,
      );
      const result = {
        requiresAdminApproval: false,
        message: RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_WITH_FULL_REFUND,
        refundAmount,
        booking: updatedBooking,
      };

      return BookingResponseMapper.toCancelBookingResponseDTO(result);
    }

    const estimatedRefund = Math.round(totalPaid * 0.5);
    const updatedBooking = await this._bookingRepository.updateById(bookingId, {
      status: "CANCEL_REQUESTED",
      "cancellation.requestedAt": now,

      "cancellation.refundAmount": estimatedRefund,
      "cancellation.reason":
        reason || "User requested cancellation (<=7 days prior)",
    } as UpdateQuery<IBookingDocument>);

    const result = {
      requiresAdminApproval: true,
      message: RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_SUBMITTED,
      estimatedRefund,
      booking: updatedBooking,
    };
    return BookingResponseMapper.toCancelBookingResponseDTO(result);
  }
}
