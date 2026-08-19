import { model, Schema } from "mongoose";
import { IChat, IParticipant } from "../interfaces/IChat";

const participantSchema = new Schema<IParticipant>(
  {
    participantId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "participants.participantModel",
    },
    participantModel: {
      type: String,
      required: true,
      enum: ["User", "Operator", "Admin"],
    },
  },
  { _id: false },
);

const ChatSchema = new Schema<IChat>(
  {
    participants: {
      type: [participantSchema],
      validate: [
        (val: any[]) => val.length === 2,
        "Chat must have exactly two participants",
      ],
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true },
);

ChatSchema.index({
  "participants.participantId": 1,
  "participants.participantModel": 1,
});

export const Chat = model<IChat>("Chat", ChatSchema);
