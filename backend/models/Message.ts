import { model, Schema } from "mongoose";
import { IMessage } from "../interfaces/IChat";

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["User", "Operator", "Admin"],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "READ"],
      default: "SENT",
    },
  },
  { timestamps: true },
);
MessageSchema.index({ chatId: 1, createdAt: -1 });
export const Message = model<IMessage>("Message", MessageSchema);
