import { injectable } from "inversify";
import { IChat } from "../interfaces/IChat";
import { Chat } from "../models/Chat";
import { BaseRepository } from "./baseRepository";
import { IChatRepository } from "../interfaces/IChatRepository";
import { Types } from "mongoose";

@injectable()
export class ChatRepository
  extends BaseRepository<IChat>
  implements IChatRepository
{
  constructor() {
    super(Chat);
  }
  async findExistingChat(
    userId1: string,
    role1: string,
    userId2: string,
    role2: string,
  ): Promise<IChat | null> {
    return Chat.findOne({
      participants: {
        $all: [
          { $elemMatch: { participantId: userId1, participantModel: role1 } },
          { $elemMatch: { participantId: userId2, participantModel: role2 } },
        ],
      },
    })
      .populate("lastMessage")
      .populate({
        path: "participants.participantId",
        select: "name email image role",
      });
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    const chats = await Chat.find({ "participants.participantId": userId })
      .populate("participants.participantId", "name email image")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    const seenRecipients = new Set<string>();
    const uniqueChats = chats.filter((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => String(p.participantId) !== String(userId),
      );
      const recipientId = String(otherParticipant?.participantId);
      if (recipientId && !seenRecipients.has(recipientId)) {
        seenRecipients.add(recipientId);
        return true;
      }
      return false;
    });
    return uniqueChats;
  }

  async incrementUnreadCount(
    chatId: string,
    recipientId: string,
    lastMessageId: string,
  ): Promise<void> {
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: lastMessageId,
      $inc: { [`unreadCount.${recipientId}`]: 1 },
    });
  }

  async resetUnreadCount(chatId: string, userId: string): Promise<void> {
    await Chat.findByIdAndUpdate(chatId, {
      $set: { [`unreadCount.${userId}`]: 0 },
    });
  }

  async save(chat: IChat): Promise<IChat> {
    return chat.save();
  }
  async findByIdAndPopulate(
    chatId: string | Types.ObjectId,
  ): Promise<IChat | null> {
    return Chat.findById(chatId)
      .populate({
        path: "participants.participantId",
        select: "name email image role",
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "name image",
        },
      });
  }
}
