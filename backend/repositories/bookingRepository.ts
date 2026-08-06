import { injectable } from "inversify";
import {
  IBooking,
  IBookingRepository,
  ICreateBookingDTO,
  IUpdateBookingStatusDTO,
} from "../interfaces/IBookingRepository";
import { BaseRepository } from "./baseRepository";
import { Booking, IBookingDocument } from "../models/Booking";

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
      pricing:dto.pricing,
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

  async findByBookingId(bookingId: string): Promise<IBooking | null> {
    return await Booking.findById(bookingId).populate("packageId").lean();
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
        select: "name destinations duration images amount",
        populate: {
          path: "destinations",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .lean();
  }
}
