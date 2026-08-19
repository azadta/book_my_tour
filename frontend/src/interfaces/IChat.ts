export interface IUserSummary {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface IParticipant {
  participantId: IUserSummary;
  participantModel: "User" | "Operator" | "Admin";
}

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  senderModel: "User" | "Operator" | "Admin";
  text: string;
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: string;
}
export  interface IMessageResponse{
  messages:IMessage[],
  total:number,
  page:number,
  hasMore:boolean
}
export interface IChat {
  _id: string;
  participants: IParticipant[];
  lastMessage?: IMessage;
  unreadCount: Record<string, number>;
  updatedAt: string;
}
