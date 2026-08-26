import { inject, injectable } from "inversify";
import { UpdateQuery } from "mongoose";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { IOperatorBookingFilter } from "../interfaces/IBooking";
import { IBookingPricing } from "../interfaces/IBookingPricing";
import type {
  IBooking,
  IBookingRepository,
} from "../interfaces/IBookingRepository";
import { IBookingService } from "../interfaces/IBookingService";
import type { ICouponRepository } from "../interfaces/ICouponRepository";
import type { IMailService } from "../interfaces/IMailService";
import type { IPackageRepository } from "../interfaces/IPackageRepository";
import type { IPaymentService } from "../interfaces/IPaymentService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IWalletRepository } from "../interfaces/IWalletRepository";
import { AttendanceStatus, IBookingDocument } from "../models/Booking";
import { CouponType, ICouponDocument } from "../models/Coupon";
import { Types } from "../types/types";
import { bookingConfirmationMessage } from "../utils/bookingConfirmationMessage";
import { CustomError } from "../utils/customError";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository,

    @inject(Types.PackageRepository)
    private packageRepository: IPackageRepository,

    @inject(Types.BookingRepository)
    private bookingRepository: IBookingRepository,
    @inject(Types.WalletRepository)
    private walletRepository: IWalletRepository,
    @inject(Types.CouponRepository)
    private couponRepository: ICouponRepository,

    @inject(Types.MailService) private mailService: IMailService,

    @inject(Types.PaymentService) private paymentService: IPaymentService,
  ) {}

  async processAdminCancellation(
    bookingId: string,
    approve: boolean,
    adminNotes?: string,
  ) {
    const booking = await this.bookingRepository.findByBookingId(bookingId);
    if (!booking || booking.status !== "CANCEL_REQUESTED") {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.CANCEL_REQ_NOT_FOUND,
        StatusCode.BAD_REQUEST,
      );
    }
    const now = new Date();
    if (approve) {
      const refundAmound = booking.cancellation?.refundAmount || 0;
      await this.walletRepository.addTransaction(booking.userId.toString(), {
        transactionId: `REFUND_${Date.now()}`,
        type: "CREDIT",
        purpose: "REFUND",
        amount: refundAmound,
        status: "SUCCESS",
        description: `50% refund approved for cancelled tour: ${booking.packageId.name}`,
      });
      return await this.bookingRepository.updateById(bookingId, {
        status: "CANCELLED",
        "cancellation.processedAt": now,
        "cancellation.adminNotes": adminNotes || "Approved by admin",
      } as UpdateQuery<IBookingDocument>);
    } else {
      return await this.bookingRepository.updateById(bookingId, {
        status: "CONFIRMED",
        "cancellation.adminNotes": adminNotes || "Rejected by Admin",
      } as UpdateQuery<IBookingDocument>);
    }
  }

  async getPendingCancelationRequests(): Promise<IBooking[]> {
    return await this.bookingRepository.getPendingCancellationRequests();
  }

  async getOperatorBookingsService(
    operatorId: string,
    status: string | undefined,
    skip: number,
    limit: number,
  ) {
    const filter: IOperatorBookingFilter = { operatorId, status };
    const [bookings, totalCount] = await Promise.all([
      this.bookingRepository.getOperatorBookings(filter, skip, limit),
      this.bookingRepository.getOperatorBookingsCount(filter),
    ]);
    return { bookings, totalCount };
  }

  async getOperatorBookingDetailsService(
    bookingId: string,
    operatorId: string,
  ) {
    const booking = await this.bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return booking;
  }

  async operatorCancelBookingService(
    bookingId: string,
    operatorId: string,
    reason: string,
  ) {
    const booking = await this.bookingRepository.getOperatorBookingDetails(
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
    await this.walletRepository.addTransaction(booking.userId._id.toString(), {
      transactionId: `REFUND_OPERATOR_${Date.now()}`,
      type: "CREDIT",
      purpose: "REFUND",
      amount: totalPaid,
      status: "SUCCESS",
      description: `Full refund (Operator cancelled tour): ${reason}`,
    });

    return await this.bookingRepository.updateById(bookingId, {
      status: "CANCELLED",
      "cancellation.requestedAt": new Date(),
      "cancellation.processedAt": new Date(),
      "cancellation.refundAmount": totalPaid,
      "cancellation.reason": `Operator Cancelled: ${reason}`,
    } as UpdateQuery<IBookingDocument>);
  }

  async operatorRescheduleBookingService(
    bookingId: string,
    operatorId: string,
    newStartDate: string,
  ) {
    const booking = await this.bookingRepository.getOperatorBookingDetails(
      bookingId,
      operatorId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    return await this.packageRepository.updatePackageById(
      booking.packageId._id.toString(),
      {
        startDate: new Date(newStartDate),
      },
    );
  }

  async updateAttendanceService(
    bookingId: string,
    operatorId: string,
    attendance: AttendanceStatus,
  ) {
    const booking = await this.bookingRepository.getOperatorBookingDetails(
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
    return await this.bookingRepository.updateById(bookingId, updateData);
  }
  async verifyCancellationService(
    bookingId: string,
    operatorId: string,
    action: "APPROVE" | "REJECT",
    operatorNotes?: string,
  ) {
    const booking = await this.bookingRepository.getOperatorBookingDetails(
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
      await this.walletRepository.addTransaction(
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

      return await this.bookingRepository.updateById(bookingId, {
        status: "CANCELLED",
        "cancellation.processedAt": new Date(),
        "cancellation.refundAmount": refundAmount,
        "cancellation.reason": `Approved by Operator: ${operatorNotes || "50% refund issued"}`,
      } as UpdateQuery<IBookingDocument>);
    } else {
      return await this.bookingRepository.updateById(bookingId, {
        status: "CONFIRMED",
        "cancellation.processedAt": Date.now(),
        "cancellation.reason": `Rejected by Operator: ${operatorNotes || "Request denied."}`,
      } as UpdateQuery<IBookingDocument>);
    }
  }
  async createBookingOrder(
    userId: string,
    dto: {
      packageId: string;
      addedActivityIds: string[];
      removedActivityIds: string[];
      generalCouponCode?: string;
      bankCouponCode?: string;
      useWallet: boolean;
    },
  ) {
    const {
      addedActivityIds = [],
      packageId,
      removedActivityIds = [],
      generalCouponCode,
      bankCouponCode,
      useWallet,
    } = dto;

    const pkg = await this.packageRepository.getPackageById(packageId);
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    let addedActivitiesAmount = 0;
    for (const day of pkg.itinerary) {
      for (const activity of day.optionalActivities) {
        if (dto.addedActivityIds.includes(activity.id)) {
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
    const subtotal = Math.max(
      0,
      baseAmount + addedActivitiesAmount - removedActivitiesAmount,
    );

    let generalCoupon: ICouponDocument | null = null;
    let bankCoupon: ICouponDocument | null = null;
    let generalDiscount = 0;
    let bankDiscount = 0;
    let runningAmount = subtotal;
    if (generalCouponCode?.trim()) {
      generalCoupon = await this.couponRepository.findByCode(
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
        subtotal < generalCoupon.minBookingAmount
      ) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.MINIMUM_AMOUNT(
            generalCoupon.minBookingAmount,
          ),
          StatusCode.BAD_REQUEST,
        );
      }

      if (generalCoupon.discountType === "PERCENTAGE") {
        generalDiscount = (subtotal * generalCoupon.discountValue) / 100;
        if (
          generalCoupon.maxDiscountAmount &&
          generalDiscount > generalCoupon.maxDiscountAmount
        ) {
          generalDiscount = generalCoupon.maxDiscountAmount;
        }
      } else {
        generalDiscount = generalCoupon.discountValue;
      }
      runningAmount -= generalDiscount;
    }

    if (bankCouponCode?.trim()) {
      bankCoupon = await this.couponRepository.findByCode(
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
        subtotal < bankCoupon.minBookingAmount
      ) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.MINIMUM_AMOUNT(
            bankCoupon.minBookingAmount,
          ),
          StatusCode.BAD_REQUEST,
        );
      }

      if (bankCoupon.discountType === "PERCENTAGE") {
        bankDiscount = (runningAmount * bankCoupon.discountValue) / 100;
        if (
          bankCoupon.maxDiscountAmount &&
          bankDiscount > bankCoupon.maxDiscountAmount
        ) {
          bankDiscount = bankCoupon.maxDiscountAmount;
        }
      } else {
        bankDiscount = bankCoupon.discountValue;
      }
      runningAmount -= bankDiscount;
    }

    const finalAmount = Math.max(0, runningAmount);
    let walletDeduction = 0;
    let remainingPayable = finalAmount;
    if (useWallet) {
      const wallet = await this.walletRepository.findOne({ userId });
      if (wallet && wallet?.balance > 0) {
        walletDeduction = Math.min(wallet?.balance, finalAmount);
        remainingPayable = finalAmount - walletDeduction;
      }
    }

    const pricing: IBookingPricing = {
      baseAmount,
      addedActivitiesAmount,
      removedActivitiesAmount,
      subtotal,
      ...(generalCoupon && {
        generalCoupon: {
          couponId: generalCoupon._id.toString(),
          code: generalCoupon.code,
          title: generalCoupon.title,
          type: generalCoupon.type,
          discountAmount: generalDiscount,
        },
      }),
      ...(bankCoupon && {
        bankCoupon: {
          couponId: bankCoupon._id.toString(),
          code: bankCoupon.code,
          title: bankCoupon.title,
          type: bankCoupon.type,
          discountAmount: bankDiscount,
        },
      }),
      totalDiscount: generalDiscount + bankDiscount,
      walletApplied: walletDeduction,
      finalAmount: remainingPayable,
    };

    if (remainingPayable === 0) {
      const internalOrderId = `ORDER_WALLET_${Date.now()}`;
      const updatedWallet = await this.walletRepository.deductBalance(
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

      const booking = await this.bookingRepository.createBooking({
        userId,
        packageId,
        razorpayOrderId: internalOrderId,
        pricing,

        addedActivityIds,
        removedActivityIds,
        status: "CONFIRMED",
      });

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(
          RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }

      await this.mailService.sendEmail(
        user?.email,
        "Tour booking confirmed",
        bookingConfirmationMessage({
          userName: user?.name,
          amount: booking.pricing.walletApplied,
          bookingId: booking._id as string,
          packageName: pkg.name,
        }),
      );
      return {
        isFullyPaidByWallet: true,
        bookingId: booking._id,
        orderId: internalOrderId,
      };
    }

    const order = await this.paymentService.createOrder({
      amount: remainingPayable,
      receipt: `receipt_pkg_${Date.now()}`,
      ...(bankCoupon && {
        offerId: bankCoupon.razorpayOfferId,
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

    await this.bookingRepository.createBooking({
      userId,
      packageId,
      razorpayOrderId: order.id,
      pricing,

      addedActivityIds,
      removedActivityIds,
      status: "PENDING",
    });

    return {
      isFullyPaidByWallet: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      packageName: pkg.name,
      packageDescription: `${pkg.duration.day}D / ${pkg.duration.night}N Tour Package`,
      offerId: bankCoupon?.razorpayOfferId || null,
    };
  }

  async verifyAndConfirmBooking(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    packageId: string;
    userId: string;
  }) {
    const isValid = this.paymentService.verifySignature({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      await this.bookingRepository.updateStatusByOrderId(dto.razorpayOrderId, {
        status: "FAILED",
      });
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_SIGNATURE,
        StatusCode.BAD_REQUEST,
      );
    }

    const booking = await this.bookingRepository.findByOrderId(
      dto.razorpayOrderId,
    );
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (booking.pricing.walletApplied && booking.pricing.walletApplied > 0) {
      await this.walletRepository.deductBalance(
        dto.userId,
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

    const updatedBooking = await this.bookingRepository.updateStatusByOrderId(
      dto.razorpayOrderId,
      {
        status: "CONFIRMED",
        razorpayPaymentId: dto.razorpayPaymentId,
      },
    );
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new CustomError(
        RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    const pkg = await this.packageRepository.findById(dto.packageId);
    if (!pkg) {
      throw new CustomError(
        RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    await this.mailService.sendEmail(
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

    return {
      message: RESPONSE_MESSAGES.BOOKING.SUCCESS.CONFIRM,
      booking: updatedBooking,
    };
  }

  async findBookingByOrderId(razorpayOrderId: string) {
    const booking = await this.bookingRepository.findByOrderId(razorpayOrderId);
    if (!booking) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.INVALID_ORDER_ID,
        StatusCode.BAD_REQUEST,
      );
    }
    return booking;
  }

  async getUserBookings(userId: string) {
    if (!userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.BOOKING.ERROR.USER_ID_MISSING,
        StatusCode.BAD_REQUEST,
      );
    }
    const bookings = await this.bookingRepository.getUserBookings(userId);

    return bookings;
  }
  async cancelBooking(userId: string, bookingId: string, reason?: string) {
    const booking = await this.bookingRepository.findByBookingId(bookingId);
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
      await this.walletRepository.addTransaction(userId, {
        transactionId: `REFUND_${Date.now()}`,
        type: "CREDIT",
        purpose: "REFUND",
        amount: refundAmount,
        status: "SUCCESS",
        description: `Full refund for cancelled tour: ${booking.packageId.name}`,
      });

      const updatedBooking = await this.bookingRepository.updateById(
        bookingId,
        {
          status: "CANCELLED",
          "cancellation.requestedAt": now,
          "cancellation.processedAt": now,
          "cancellation.refundAmount": refundAmount,
          "cancellation.reason": reason || "User cancelled (>7 days prior)",
        } as UpdateQuery<IBookingDocument>,
      );
      return {
        requiresAdminApproval: false,
        message: RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_WITH_FULL_REFUND,
        refundAmount,
        booking: updatedBooking,
      };
    }

    const estimatedRefund = Math.round(totalPaid * 0.5);
    const updatedBooking = await this.bookingRepository.updateById(bookingId, {
      status: "CANCEL_REQUESTED",
      "cancellation.requestedAt": now,

      "cancellation.refundAmount": estimatedRefund,
      "cancellation.reason":
        reason || "User requested cancellation (<=7 days prior)",
    } as UpdateQuery<IBookingDocument>);

    return {
      requiresAdminApproval: true,
      message: RESPONSE_MESSAGES.BOOKING.SUCCESS.CANCEL_REQ_SUBMITTED,
      estimatedRefund,
      booking: updatedBooking,
    };
  }
}
