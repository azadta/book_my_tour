import { inject, injectable } from "inversify";
import { ICouponService } from "../interfaces/ICouponService";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { CustomError } from "../utils/customError";
import { CouponType, ICouponDocument } from "../models/Coupon";
import { StatusCode } from "../constants/statusCodeConstants";
import type { ICouponRepository } from "../interfaces/ICouponRepository";
import { Types } from "../types/types";
import {
  createCouponInput,
  createCouponRequestDTO,
  updateCouponInput,
  updateCouponRequestDTO,
  ValidateCouponBody,
  ValidateCouponRequestDTO,
} from "../dto-mapping/dto/coupon/couponRequestDTO";
import { CouponResponseMapper } from "../dto-mapping/mapper/coupon/CouponResponseMapper";
import { CouponRequestMapper } from "../dto-mapping/mapper/coupon/CouponRequestMapper";
import { STATUS_CODES } from "node:http";

@injectable()
export class CouponService implements ICouponService {
  constructor(
    @inject(Types.CouponRepository)
    private _couponRepository: ICouponRepository,
  ) {}

  async getAllCoupons(page: number, limit: number) {
    const result = await this._couponRepository.findAllCoupons(page, limit);
    return {
      coupons: CouponResponseMapper.toCouponResponseDTOList(result.coupons),
      totalCount: result.totalCount,
    };
  }

  async getCouponById(id: string) {
    const coupon = await this._couponRepository.findById(id);
    if (!coupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return CouponResponseMapper.toCouponResponseDTO(coupon);
  }

  async createCoupon(body: createCouponInput) {
    const dto = CouponRequestMapper.toCouponRequestDTO(body);
    if (!dto.code) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.COUPON_CODE_MISSING,
        StatusCode.BAD_REQUEST,
      );
    }
    const existingCoupon = await this._couponRepository.findOne({
      code: dto.code.toUpperCase(),
    });
    if (existingCoupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.CODE_ALREADY_EXIST,
        StatusCode.BAD_REQUEST,
      );
    }

    const coupon = await this._couponRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
    });

    return CouponResponseMapper.toCouponResponseDTO(coupon);
  }

  async updateCoupon(id: string, body: updateCouponInput) {
    const dto = CouponRequestMapper.toCouponRequestDTO(body);
    const existingCoupon = await this._couponRepository.findById(id);
    if (!existingCoupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }

    if (dto.code && dto.code.toUpperCase() !== existingCoupon.code) {
      const codeTaken = await this._couponRepository.findOne({
        code: dto.code.toUpperCase(),
        _id: { $ne: id },
      });

      if (codeTaken) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.CODE_ALREADY_EXIST,
          StatusCode.BAD_REQUEST,
        );
      }
    }
    if (dto.code) dto.code = dto.code.toUpperCase();
    const updatedPayload: {
      $set: Partial<ICouponDocument>;
      $unset: Record<string, string>;
    } = {
      $set: { ...dto },
      $unset: {},
    };

    if (dto.type === CouponType.GENERAL) {
      ((updatedPayload.$unset.bankName = ""),
        (updatedPayload.$unset.allowedBins = ""),
        delete updatedPayload.$set.bankName);
      delete updatedPayload.$set.allowedBins;
    }

    const updatedCoupon = await this._couponRepository.updateCouponById(
      id,
      updatedPayload,
    );
    if (!updatedCoupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return CouponResponseMapper.toCouponResponseDTO(updatedCoupon);
  }

  async toggleCouponStatus(id: string, isActive: boolean) {
    const coupon = await this._couponRepository.findById(id);
    if (!coupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    const updatedCoupon = await this._couponRepository.toggleStatus(
      id,
      isActive,
    );
    if (!updatedCoupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return CouponResponseMapper.toCouponResponseDTO(updatedCoupon);
  }

  async getAllAvailableCoupons() {
    const coupons = await this._couponRepository.findActiveCoupons();
    const bankOffers = coupons.filter((c) => c.type === CouponType.BANK);
    const generalCoupons = coupons.filter((c) => c.type === CouponType.GENERAL);
    const data = { bankOffers, generalCoupons };
    return CouponResponseMapper.toAvailableCouponsDTO(data);
  }

  async validateAndCalculateCouponDiscount(
    body:ValidateCouponBody,
  ) {
    const dto = CouponRequestMapper.toValidateCouponDTO(body);
    const { bookingAmount, code, cardBin } = dto;
    const coupon = await this._couponRepository.findByCode(code);
    if (!coupon) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.INVALID_CODE,
        StatusCode.BAD_REQUEST,
      );
    }
    if (coupon.minBookingAmount && bookingAmount < coupon.minBookingAmount) {
      throw new CustomError(
        RESPONSE_MESSAGES.COUPON.ERROR.MINIMUM_AMOUNT(coupon.minBookingAmount),
      );
    }
    if (coupon.type === CouponType.BANK) {
      if (!cardBin) {
        throw new CustomError(RESPONSE_MESSAGES.COUPON.ERROR.CARD_BIN_MISSING);
      }
      if (
        coupon.allowedBins &&
        coupon.allowedBins.length > 0 &&
        !coupon.allowedBins.includes(cardBin)
      ) {
        throw new CustomError(
          RESPONSE_MESSAGES.COUPON.ERROR.BANK_MISMATCH(coupon.bankName),
        );
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (bookingAmount * coupon.discountValue) / 100;
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }
    const finalPrice = Math.max(0, bookingAmount - discountAmount);
    const result= { discountAmount, finalPrice, coupon }
   return CouponResponseMapper.toValidateCouponResponseDTO(result)
  }
}
