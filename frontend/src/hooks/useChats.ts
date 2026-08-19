import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IChat, IMessage, IMessageResponse } from "@/interfaces/IChat";
import {
  addMessage,
  incrementUnreadBadge,
  setActiveChat,
  setChats,
  setMessages,
  setTypingStatus,
  updateMessageStatus,
  updateUserStatus,
} from "@/redux/chatSlice";
import type { RootState } from "@/redux/store";
import { connectSocket, disconnectSocket, getSocket } from "@/socket/socket";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCurrentUser } from "./useCurrentUser";

export const useChat = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { activeChat, chats, messages, onlineUsers, typingUsers } = useSelector(
    (state: RootState) => state.chat,
  );


  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const accessChat = useCallback(
    async (
      participientId: string,
      participientModel: "User" | "Operator" | "Admin" = "Operator",
    ) => {
      try {
        const response = await axiosInstance.post<IChat>(
          APP_ROUTES.CHATS.ACCESS_CHAT,
          { targetId: participientId, targetModel: participientModel },
        );
        const chat = response.data;
        dispatch(setChats([...chats.filter((c) => c._id !== chat._id), chat]));
        console.log('chatFromAccessChat',chat)
        dispatch(setActiveChat(chat));
        const socket = getSocket();
        socket.emit("join_chat", chat._id);
        const msgResponse = await axiosInstance.get<IMessageResponse>(
          APP_ROUTES.CHATS.CHAT_MESSAGES(chat._id),
        );
        if (activeChat) {
          socket.emit("join_chat", activeChat._id);
        }

        dispatch(setMessages(msgResponse.data.messages || []));
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          FEEDBACK_MESSAGES.CHATS.ERROR.START_CHAT;
        toast.error(message);
        console.error(message, error);
      }
    },
    [dispatch, chats],
  );

  useEffect(() => {
    return () => {
      if (activeChatRef.current?._id) {
        const socket = getSocket();
        socket.emit("leave_chat", activeChatRef.current._id);
      }
      dispatch(setActiveChat(null));
      dispatch(setMessages([]));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser) {
      disconnectSocket();
      return;
    }
    connectSocket();
    const socket = getSocket();
    const handleConnect = () => {
      if (activeChat?._id) {
        socket.emit("join_chat", activeChat._id);
      }
    };
    socket.on("connect", handleConnect);
    socket.on(
      "message_read",
      (data: { chatId: string; messageIds: string[]; readBy: string }) => {
        dispatch(
          updateMessageStatus({
            chatId: data.chatId,
            status: "READ",
            messageIds: data.messageIds,
          }),
        );
      },
    );
    socket.on("receive_message", (message: IMessage) => {
      if (activeChat && message.chatId === activeChat._id) {
        dispatch(addMessage(message));
        if (message.senderId !== currentUser.id) {
          socket.emit("mark_as_read", {
            chatId: activeChat._id,
            messageIds: [message._id],
            readBy: currentUser.id,
          });
        }
      } else {
        dispatch(
          incrementUnreadBadge({
            chatId: message.chatId,
            userId: currentUser.id,
          }),
        );
      }
    });

    socket.on(
      "user_status_change",
      (data: { userId: string; isOnline: boolean }) => {
        dispatch(updateUserStatus(data));
      },
    );
    socket.on("user_typing", ({ chatId }: { chatId: string }) => {
      dispatch(setTypingStatus({ chatId, isTyping: true }));
    });
    socket.on("user_stop_typing", ({ chatId }: { chatId: string }) => {
      dispatch(setTypingStatus({ chatId, isTyping: false }));
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message");
      socket.off("user_status_change");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("message_read");
    };
  }, [currentUser, activeChat, dispatch]);

  const fetchChats = useCallback(async () => {
    try {
      const response = await axiosInstance.get<IChat[]>(
        APP_ROUTES.CHATS.MY_CHATS,
      );
      dispatch(setChats(response.data));
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.CHATS.ERROR.FETCH_CHATS;
      toast.error(message);
      console.error(message, error);
    }
  }, [dispatch]);

  const selectChat = useCallback(
    async (chat: IChat | null) => {
      const socket = getSocket();
      if (!chat) {
        if (activeChat?._id) {
          socket.emit("leave_chat", activeChat._id);
        }
        dispatch(setActiveChat(null));
        dispatch(setMessages([]));
        return;
      }
      if (activeChat?._id && activeChat._id !== chat._id) {
        socket.emit("leave_chat", activeChat._id);
      }
      dispatch(setActiveChat(chat));

      socket.emit("join_chat", chat._id);

      try {
        const response = await axiosInstance.get<IMessageResponse>(
          APP_ROUTES.CHATS.CHAT_MESSAGES(chat._id),
        );
        const fetchedMessages = response.data.messages || [];
        dispatch(setMessages(fetchedMessages));
        if (currentUser) {
          const unreadMessageIds = fetchedMessages
            .filter((m) => m.senderId !== currentUser.id && m.status !== "READ")
            .map((m) => m._id);
          if (unreadMessageIds.length > 0) {
            socket.emit("mark_as_read", {
              chatId: chat._id,
              messageIds: unreadMessageIds,
              readBy: currentUser.id,
            });
          }
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          FEEDBACK_MESSAGES.CHATS.ERROR.FETCH_MESSAGES;
        toast.error(message);
        console.error(message, error);
      }
    },
    [dispatch],
  );

  const sendMessage = useCallback(
    async (text: string, recipientId: string) => {
      if (!activeChat || !text.trim() || !currentUser) return;
      const socket = getSocket();
      socket.emit("send_message", {
        chatId: activeChat._id,
        text,
        recipientId,

        senderModel: currentUser?.role,
      });
    },
    [activeChat, currentUser],
  );

  const accessChatOnly = useCallback(
    async (
      participantId: string,
      participantModel: "User" | "Operator" | "Admin" = "Operator",
    ) => {
      try {
        const response = await axiosInstance.post<IChat>(
          APP_ROUTES.CHATS.ACCESS_CHAT,
          { targetId: participantId, targetModel: participantModel },
        );
        const chat = response.data;
        dispatch(setChats([...chats.filter((c) => c._id !== chat._id), chat]));
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          FEEDBACK_MESSAGES.CHATS.ERROR.START_CHAT;
        toast.error(message);
        console.error(message, error);
      }
    },
    [dispatch, chats],
  );

  return {
    chats,
    activeChat,
    messages,
    onlineUsers,
    typingUsers,
    fetchChats,
    selectChat,
    sendMessage,
    accessChat,
    accessChatOnly
  };
};
