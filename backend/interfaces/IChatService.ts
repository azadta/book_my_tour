import { IChat, IMessage } from "./IChat";

export interface IChatService {
  accessChatService(
    currentUserId: string,
    currentUserRole: "User" | "Operator" | "Admin",
    targetId: string,
    targetModal: "User" | "Operator" | "Admin",
  ): Promise<IChat>;
  getMyChatsService(userId: string): Promise<IChat[]>;
  getChatMessagesService(
    chatId: string,
    page: number,
    limit: number,
  ): Promise<{
    messages: IMessage[];
    total: number;
    page: number;
    hasMore: boolean;
  }>;
  saveMessageService(data: {
    chatId: string;
    senderId: string;
    senderModel: "User" | "Operator" | "Admin";
    text: string;
    status: "SENT" | "DELIVERED";
  }): Promise<IMessage>;
}
