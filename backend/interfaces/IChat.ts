import { Document, Types } from "mongoose";

export interface IParticipant {
  participantId: Types.ObjectId | string;
  participantModel: "User" | "Operator" | "Admin";
}

export interface IChat extends Document {
  participants: IParticipant[];
  lastMessage?: Types.ObjectId | string;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  chatId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  senderModel: "User" | "Operator" | "Admin";
  text: string;
  attachments: string[];
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: Date;
  updatedAt: Date;
}
