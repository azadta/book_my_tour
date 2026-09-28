import { inject, injectable } from "inversify";
import { IChatService } from "../interfaces/IChatService";
import { Types } from "../types/types";
import type { IChatRepository } from "../interfaces/IChatRepository";
import type { IMessageRepository } from "../interfaces/IMessageRepository";
import { IChat, IMessage } from "../interfaces/IChat";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import type{ ISocketService } from "../interfaces/ISocketService";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(Types.ChatRepository) private _chatRepository: IChatRepository,
    @inject(Types.MessageRepository)
    private _messageRepository: IMessageRepository,
    @inject(Types.SocketService)
    private _socketService: ISocketService,
  ) {}
  async accessChatService(
    currentUserId: string,
    currentUserRole: "User" | "Operator" | "Admin",
    targetId: string,
    targetModel: "User" | "Operator" | "Admin",
  ): Promise<IChat> {
    let chat = await this._chatRepository.findExistingChat(
      currentUserId,
      currentUserRole,
      targetId,
      targetModel,
    );
    let isNewChat=false
    if (!chat) {
      isNewChat=true
      const createdChat = await this._chatRepository.create({
        participants: [
          { participantId: currentUserId, participantModel: currentUserRole },
          { participantId: targetId, participantModel: targetModel },
        ],
      });

      chat = await this._chatRepository.findByIdAndPopulate(createdChat._id);
      if (!chat) {
        throw new CustomError(
          RESPONSE_MESSAGES.CHAT.ERROR.RETRIEVE_AFTER_CREATION,
        );
      }
    }
    if(isNewChat&&chat){
      this._socketService.emitToUser(targetId,'new_chat',chat)
    }
    return chat;
  }

  async getMyChatsService(userId: string): Promise<IChat[]> {
    return this._chatRepository.getUserChats(userId);
  }

  async getChatMessagesService(
    chatId: string,
    page: number,
    limit: number,
  ): Promise<{
    messages: IMessage[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;
    const [messages, total] = await this._messageRepository.getPaginatedMessages(
      chatId,
      skip,
      limit,
    );
    return { messages, total, page, hasMore: skip + messages.length < total };
  }
  async saveMessageService(data: {
    chatId: string;
    senderId: string;
    senderModel: "User" | "Operator" | "Admin";
    text: string;
    image?:string;
    status: "SENT" | "DELIVERED";
  }): Promise<IMessage> {
    const message = await this._messageRepository.create(data);
    return message;
  }
 async clearChatService(chatId:string,userId:string):Promise<void>{
    await this._messageRepository.deleteMessageByChatId(chatId)
    await this._chatRepository.clearChatLastMessage(chatId)
  }
}
