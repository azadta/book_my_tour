import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "./useCurrentUser";
import type { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { connectSocket, getSocket } from "@/socket/socket";
import {
  clearChatMessages,
  incrementUnreadBadge,
  setChats,
  updateChatLastMessage,
} from "@/redux/chatSlice";
import { axiosInstance } from "@/api/axiosInstance";
import type { IChat, IMessage } from "@/interfaces/IChat";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

export const useGlobalChatSocket = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { activeChat, chats } = useSelector((state: RootState) => state.chat);
  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);
  useEffect(() => {
    if (!currentUser) return;
    const fetchInitialChats = async () => {
      try {
        const response = await axiosInstance.get<IChat[]>(
          APP_ROUTES.CHATS.ANY.MY_CHATS,
        );
        dispatch(setChats(response.data));
      } catch (error) {
        console.error(FEEDBACK_MESSAGES.CHATS.ERROR.FETCH_CHATS, error);
      }
    };
    fetchInitialChats();
    connectSocket();
    const socket = getSocket();
    const handleReceiveMessage = (data: {
      chatId: string;
      message: IMessage;
    }) => {
      const { chatId, message } = data;
      const currentActiveChat = activeChatRef.current;
      if (!currentActiveChat || currentActiveChat._id !== chatId) {
        dispatch(
          incrementUnreadBadge({
            chatId: message.chatId,
            userId: currentUser.id,
          }),
        );
      }
      dispatch(updateChatLastMessage({ chatId: chatId, message }));
    };
    const handleChatCleared = ({ chatId }: { chatId: string }) => {
      dispatch(clearChatMessages(chatId));
    };
    const handleNewChat = (newChat: IChat) => {
      const currentChats = chatsRef.current;
      if (!currentChats.some((c) => c._id === newChat._id)) {
        dispatch(setChats([newChat, ...currentChats]));
      }
    };
    socket.on("new_chat", handleNewChat);
    socket.on("new_message_notification", handleReceiveMessage);
    socket.on("chat_cleared", handleChatCleared);
    return () => {
      socket.off("new_message_notification", handleReceiveMessage);
      socket.off("chat_cleared", handleChatCleared);
      socket.off("new_chat", handleNewChat);
    };
  }, [currentUser?.id, dispatch]);
};
