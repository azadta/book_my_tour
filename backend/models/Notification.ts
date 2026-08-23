import { Document, model, Schema, Types } from "mongoose";

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId;
  title: string;
  message: string;
  bookingId: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "Operator", required: true },
    title: { type: String, ref: "Operator", required: true },
    message: { type: String, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification=model<INotification>('Notification',notificationSchema)