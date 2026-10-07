import { injectable } from "inversify";
import { IMessage } from "../interfaces/IChat";
import { IMessageRepository } from "../interfaces/IMessageRepository";
import { Message } from "../models/Message";
import { BaseRepository } from "./baseRepository";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(Message);
  }
  async getPaginatedMessages(
    chatId: string,
    skip: number,
    limit: number,
  ): Promise<[IMessage[], number]> {
    const [messages, total] = await Promise.all([
      Message.find({ chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments({ chatId }),
    ]);
    return [messages.reverse(), total];
  }
  async markMessagesAsRead(
    messageIds: string[],
    chatId: string,
  ): Promise<void> {
    await Message.updateMany(
      { _id: { $in: messageIds }, chatId },
      { $set: { status: "READ" } },
    );
  }

  async markAllMessagesAsReadInChat(chatId:string,currentUserId:string){
    await Message.updateMany({chatId,senderId:{$ne:currentUserId},status:{$ne:'READ'}},{$set:{status:'READ'}})
  }

  async deleteMessageByChatId(chatId:string):Promise<void>{
    await Message.deleteMany({chatId})

  }
}
