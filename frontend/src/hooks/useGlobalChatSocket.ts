import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "./useCurrentUser";
import type { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { connectSocket, getSocket } from "@/socket/socket";
import {
  incrementUnreadBadge,
  setChats,
  updateChatLastMessage,
} from "@/redux/chatSlice";
import { axiosInstance } from "@/api/axiosInstance";
import type { IChat } from "@/interfaces/IChat";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

export const useGlobalChatSocket = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  useEffect(() => {
    if (!currentUser) return;
    const fetchInitialChats = async () => {
      try {
        const response = await axiosInstance.get<IChat[]>(
          APP_ROUTES.CHATS.MY_CHATS,
        );
        dispatch(setChats(response.data));
      } catch (error) {
        console.error(FEEDBACK_MESSAGES.CHATS.ERROR.FETCH_CHATS, error);
      }
    };
    fetchInitialChats();
    connectSocket();
    const socket = getSocket();
    const handleReceiveMessage = (message: any) => {
      const currentActiveChat = activeChatRef.current;
      if (!currentActiveChat || currentActiveChat._id !== message.chatId) {
        dispatch(
          incrementUnreadBadge({
            chatId: message.chatId,
            userId: currentUser.id,
          }),
        );
      }
      dispatch(updateChatLastMessage({ chatId: message.chatId, message }));
    };
    socket.on("new_message_notification", handleReceiveMessage);
    return () => {
      socket.off("new_message_notification", handleReceiveMessage);
    };
  }, [currentUser?.id, dispatch]);
};
