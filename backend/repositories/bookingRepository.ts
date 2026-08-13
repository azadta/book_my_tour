import { injectable } from "inversify";
import {
  IBooking,
  IBookingRepository,
  ICreateBookingDTO,
  IUpdateBookingStatusDTO,
} from "../interfaces/IBookingRepository";
import { BaseRepository } from "./baseRepository";
import {
  Booking,
  IBookingDocument,
  IPopulatedBooking,
} from "../models/Booking";
import { Ipackage } from "../models/Package";
import {
  IOperatorBookingDetails,
  IOperatorBookingFilter,
  IOperatorBookingStats,
} from "../interfaces/IBooking";
import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingDocument>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async createBooking(dto: ICreateBookingDTO): Promise<IBooking> {
    const newBooking = await Booking.create({
      userId: dto.userId,
      packageId: dto.packageId,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId || null,
      pricing: dto.pricing,
      addedActivityIds: dto.addedActivityIds || [],
      removedActivityIds: dto.removedActivityIds || [],
      status: dto.status || "PENDING",
    });

    return newBooking.toObject();
  }

  async findByOrderId(razorpayOrderId: string): Promise<IBooking | null> {
    return await Booking.findOne({ razorpayOrderId })
      .populate("packageId")
      .lean();
  }

  async findByBookingId(bookingId: string): Promise<IPopulatedBooking | null> {
    return await Booking.findById(bookingId)
      .populate<{ packageId: Ipackage }>("packageId")
      .lean();
  }

  async updateStatusByOrderId(
    razorpayOrderId: string,
    dto: IUpdateBookingStatusDTO,
  ): Promise<IBooking | null> {
    const updateData: Record<string, any> = { status: dto.status };
    if (dto.razorpayPaymentId) {
      updateData.razorpayPaymentId = dto.razorpayPaymentId;
    }

    return await Booking.findOneAndUpdate(
      { razorpayOrderId },
      { $set: updateData },
      { new: true },
    ).lean();
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return await Booking.find({ userId })
      .populate({
        path: "packageId",
        select: "name destinations duration images amount startDate",
        populate: {
          path: "destinations",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getPendingCancellationRequests(): Promise<IBooking[]> {
    return Booking.find({ status: "CANCEL_REQUESTED" })
      .populate({
        path: "packageId",
        select: "name destinations duration images amount startDate",
      })
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .sort({ "cancelation.requestedAt": -1 })
      .lean();
  }

  async getOperatorBookings(
    filter: IOperatorBookingFilter,
    skip: number,
    limit: number,
  ): Promise<IPopulatedBooking[]> {
    const pipeline: any[] = [
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageId",
        },
      },
      { $unwind: "$packageId" },
      {
        $match: {
          "packageId.operatorId": new mongoose.Types.ObjectId(
            filter.operatorId,
          ),
          ...(filter.status ? { status: filter.status } : {}),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { "userId.password": 0, "userId.refreshToken": 0 } },
    ];
    return Booking.aggregate(pipeline);
  }

  async getOperatorBookingsCount(
    filter: IOperatorBookingFilter,
  ): Promise<number> {
    const pipeline: any[] = [
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageId",
        },
      },
      { $unwind: "$packageId" },
      {
        $match: {
          "packageId.operatorId": new mongoose.Types.ObjectId(
            filter.operatorId,
          ),
          ...(filter.status ? { status: filter.status } : {}),
        },
      },
      { $count: "total" },
    ];
    const res = await Booking.aggregate(pipeline);
    return res[0]?.total || 0;
  }

  async getOperatorBookingDetails(
    bookingId: string,
    operatorId: string,
  ): Promise<IOperatorBookingDetails | null> {
    const booking = await Booking.findById(bookingId)
      .populate<{ packageId: Ipackage }>({
        path: "packageId",
        populate: { path: "destinations", select: "name" },
      })
      .populate<{ userId: IUser }>("userId", "name email phone")
      .lean();
    if (!booking || String(booking.packageId.operatorId) !== operatorId) {
      return null;
    }
    return booking;
  }

  async getOperatorStats(operatorId: string): Promise<IOperatorBookingStats> {
    const pipeline = [
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageId",
        },
      },
      { $unwind: "$packageId" },
      {
        $match: {
          "packageId.operatorId": new mongoose.Types.ObjectId(operatorId),
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] },
          },
          cancelRequestedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "CANCEL_REQUESTED"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "CONFIRMED"] },
                { $add: ["$pricing.finalAmount", "$pricing.walletApplied"] },
                0,
              ],
            },
          },
        },
      },
    ];
    const result = await Booking.aggregate(pipeline);
    return (
      result[0] || {
        totalBookings: 0,
        confirmedBookings: 0,
        cancelRequestedBookings: 0,
        totalRevenue: 0,
      }
    );
  }
}
