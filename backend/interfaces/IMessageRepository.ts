import { BaseRepository } from "../repositories/baseRepository";
import { IMessage } from "./IChat";

export interface IMessageRepository extends BaseRepository<IMessage> {
  getPaginatedMessages(
    chatId: string,
    skip: number,
    limit: number,
  ): Promise<[IMessage[], number]>;
  markMessagesAsRead(messageIds: string[], chatId: string): Promise<void>;
  markAllMessagesAsReadInChat(
    chatId: string,
    currentUserId: string,
  ): Promise<void>;
}
