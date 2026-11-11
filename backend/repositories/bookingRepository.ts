import { injectable } from "inversify";
import {
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
  IAdminBookingStats,
  IOperatorBookingDetails,
  IOperatorBookingFilter,
  IOperatorBookingStats,
  IPopulatedBookingDetails,
} from "../interfaces/IBooking";
import mongoose, { HydratedDocument, PipelineStage } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { PendingCancellationInput } from "../dto-mapping/dto/booking/bookingResponseDTO";

const commissionRate = Number(process.env.BOOKING_COMMISION ?? 5) / 100;
@injectable()
export class BookingRepository
  extends BaseRepository<IBookingDocument>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async createBooking(dto: ICreateBookingDTO): Promise<IBookingDocument> {
    const newBooking = await Booking.create({
      userId: dto.userId,
      packageId: dto.packageId,
      primaryContact: dto.primaryContact,
      members: dto.members,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId || null,
      pricing: dto.pricing,
      addedActivityIds: dto.addedActivityIds || [],
      removedActivityIds: dto.removedActivityIds || [],
      status: dto.status || "PENDING",
    });

    return newBooking.toObject();
  }

  async findByOrderId(
    razorpayOrderId: string,
  ): Promise<IBookingDocument | null> {
    return await Booking.findOne({ razorpayOrderId })
      .populate("packageId")
      .lean();
  }

  async findByBookingId(bookingId: string): Promise<IPopulatedBooking | null> {
    return await Booking.findById(bookingId).populate<{
      packageId: HydratedDocument<Ipackage>;
    }>("packageId");
  }

  async updateStatusByOrderId(
    razorpayOrderId: string,
    dto: IUpdateBookingStatusDTO,
  ): Promise<IBookingDocument | null> {
    const updateData: Partial<
      Pick<IBookingDocument, "status" | "razorpayPaymentId">
    > = { status: dto.status };
    if (dto.razorpayPaymentId) {
      updateData.razorpayPaymentId = dto.razorpayPaymentId;
    }

    return await Booking.findOneAndUpdate(
      { razorpayOrderId },
      { $set: updateData },
      { new: true },
    ).lean();
  }

  async getUserBookings(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ bookings: IBookingDocument[]; totalCount: number }> {
    const [bookings, totalCount] = await Promise.all([
      Booking.find({ userId })
        .populate({
          path: "packageId",
          select: "name destinations duration images amount startDate operatorId",
          populate: {
            path: "destinations",
            select: "name",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments({ userId }),
    ]);
    return { bookings, totalCount };
  }

  async getPendingCancellationRequests(): Promise<PendingCancellationInput[]> {
    return Booking.find({ status: "CANCEL_REQUESTED" })
      .populate<{ packageId: Ipackage }>({
        path: "packageId",
        select: "name destinations duration images amount startDate",
      })
      .populate<{ userId: IUser }>({
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
    const pipeline: PipelineStage[] = [
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
    const pipeline: PipelineStage[] = [
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
      .populate<{ packageId: HydratedDocument<Ipackage> }>({
        path: "packageId",
        populate: { path: "destinations", select: "name" },
      })
      .populate<{ userId: HydratedDocument<IUser> }>(
        "userId",
        "name email phone",
      );

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
          grossSales: {
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
      {
        $project: {
          _id: 0,
          totalBookings: 1,
          confirmedBookings: 1,
          cancelRequestedBookings: 1,
          totalRevenue: { $multiply: ["$grossSales", 1 - commissionRate] },
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

  async getMonthlyRevenue(operatorId: string) {
    const pipeline: PipelineStage[] = [
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
          status: "CONFIRMED",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          grossSales: {
            $sum: { $add: ["$pricing.finalAmount", "$pricing.walletApplied"] },
          },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: { $multiply: ["$grossSales", 1 - commissionRate] },
          totalBookings: 1,
        },
      },
    ];
    return await Booking.aggregate(pipeline);
  }

  async getBookingStatusBreakDown(operatorId: string) {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageId",
        },
      },
      {
        $unwind: "$packageId",
      },
      {
        $match: {
          "packageId.operatorId": new mongoose.Types.ObjectId(operatorId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ];
    return Booking.aggregate(pipeline);
  }

  async getAdminStats(): Promise<IAdminBookingStats> {
    const pipeline = [
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
          grossBookingValue: {
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
      {
        $project: {
          _id: 0,
          totalBookings: 1,
          confirmedBookings: 1,
          cancelRequestedBookings: 1,
          totalRevenue: {
            $multiply: ["$grossBookingValue", 1 - commissionRate],
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
  async getAdminMonthlyRevenue() {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: "CONFIRMED",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          grossBookingValue: {
            $sum: { $add: ["$pricing.finalAmount", "$pricing.walletApplied"] },
          },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: { $multiply: ["$grossBookingValue", commissionRate] },
          totalBookings: 1,
        },
      },
    ];
    return await Booking.aggregate(pipeline);
  }
  async getAdminBookingStatusBreakDown() {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ];
    return Booking.aggregate(pipeline);
  }

  async getBookingDetails(
    bookingId: string,
  ): Promise<IPopulatedBookingDetails | null> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(bookingId),
        },
      },
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
        $lookup: {
          from: "destinations",
          localField: "packageId.destinations",
          foreignField: "_id",
          as: "packageId.destinations",
        },
      },
      {
        $addFields: {
          allOptionalActivities: {
            $reduce: {
              input: "$packageId.itinerary",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this.optionalActivities"],
              },
            },
          },
          allCustomizableActivities: {
            $reduce: {
              input: "$packageId.itinerary",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $filter: {
                      input: "$$this.activities",
                      as: "act",
                      cond: { $eq: ["$$act.customizable", true] },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          addedActivities: {
            $filter: {
              input: "$allOptionalActivities",
              as: "opt",
              cond: { $in: ["$$opt.id", "$addedActivityIds"] },
            },
          },
          removedActivities: {
            $filter: {
              input: "$allCustomizableActivities",
              as: "cust",
              cond: { $in: ["$$cust.id", "$removedActivityIds"] },
            },
          },
        },
      },
      {
        $project: {
          allOptionalActivities: 0,
          allCustomizableActivities: 0,
          "packageId.itinerary": 0,
          "packageId.specifications": 0,
          "packageId.amount": 0,
          "packageId.category": 0,
          "packageId.operatorId": 0,
          "packageId.childpricing": 0,
          "packageId.remark": 0,
          "packageId.availableSlots": 0,
        },
      },
    ];
    const results = await Booking.aggregate<IPopulatedBookingDetails>(pipeline);
    return results[0] || null;
  }
}
