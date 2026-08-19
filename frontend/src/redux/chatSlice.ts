import type { IChat, IMessage } from "@/interfaces/IChat";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: IChat[];
  activeChat: IChat | null;
  messages: IMessage[];
  onlineUsers: string[];
  typingUsers: Record<string, boolean>;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: [],
  onlineUsers: [],
  typingUsers: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<IChat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<IChat | null>) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      if (!state.messages.some((m) => m._id === action.payload._id)) {
        state.messages.push(action.payload);
      }
      const chatIndex = state.chats.findIndex(
        (c) => c._id === action.payload.chatId,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload;
        state.chats[chatIndex].updatedAt = new Date().toISOString();
        const [updatedChat] = state.chats.splice(chatIndex, 1);
        state.chats.unshift(updatedChat);
      }
    },

    prependOlderMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = [...action.payload, ...state.messages];
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>,
    ) => {
      if (action.payload.isOnline) {
        if (!state.onlineUsers.includes(action.payload.userId)) {
          state.onlineUsers.push(action.payload.userId);
        } else {
          state.onlineUsers = state.onlineUsers.filter(
            (id) => id !== action.payload.userId,
          );
        }
      }
    },
    setTypingStatus: (
      state,
      action: PayloadAction<{ chatId: string; isTyping: boolean }>,
    ) => {
      state.typingUsers[action.payload.chatId] = action.payload.isTyping;
    },
    resetUnreadBadge: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>,
    ) => {
      const { chatId, userId } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat && chat?.unreadCount) {
        chat.unreadCount[userId] = 0;
      }
    },
    incrementUnreadBadge: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>,
    ) => {
      const { chatId, userId } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) {
        if (!chat.unreadCount) chat.unreadCount = {};
        chat.unreadCount[userId] = (chat.unreadCount[userId] || 0) + 1;
      }
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        chatId: string;
        status: "DELIVERED" | "READ";
        messageIds: string[];
      }>,
    ) => {
      const { chatId, status, messageIds } = action.payload;
      if (state.activeChat?._id === chatId) {
        state.messages = state.messages.map((msg) => {
          if (!messageIds || messageIds.includes(msg._id)) {
            return { ...msg, status };
          }
          return msg;
        });
      }
    },
  },
});

export const {
  setChats,
  addMessage,
  prependOlderMessages,
  setActiveChat,
  setMessages,
  setOnlineUsers,
  setTypingStatus,
  updateUserStatus,
  resetUnreadBadge,
  incrementUnreadBadge,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
