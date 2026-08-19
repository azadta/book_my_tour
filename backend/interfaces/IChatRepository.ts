import { Types } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { IChat } from "./IChat";

export interface IChatRepository extends IBaseRepository<IChat> {
  findExistingChat(
    userId1: string,
    role1: string,
    userId2: string,
    role2: string,
  ): Promise<IChat | null>;
  getUserChats(userId: string): Promise<IChat[]>;
  incrementUnreadCount(
    chatId: string,
    reciepentId: string,
    lastMessageId: string,
  ): Promise<void>;
  resetUnreadCount(chatId: string, userId: string): Promise<void>;
  save(chat: IChat): Promise<IChat>;
  findByIdAndPopulate(chatId: string|Types.ObjectId): Promise<IChat | null>;
}
