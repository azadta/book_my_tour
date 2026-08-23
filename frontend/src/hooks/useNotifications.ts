import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCurrentUser } from "./useCurrentUser";
import { connectSocket, getSocket } from "@/socket/socket";
import {
  setNotifications,
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  clearNotifications,
  type INotification,
  addNotification,
} from "@/redux/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification,
  );

  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get<{
        notifications: INotification[];
        unreadCount: number;
      }>(APP_ROUTES.NOTIFICATIONS.USER_NOTIFICATIONS);
      dispatch(
        setNotifications({
          notifications: response.data.notifications || [],
          unreadCount: response.data.unreadCount || 0,
        }),
      );
  
    } catch (error: any) {
      const message =
        error.response?.data?.messsage ||
        FEEDBACK_MESSAGES.NOTIFICATIONS.ERROR.FETCH;
      toast.error(message);
      console.error(message, error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, dispatch]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await axiosInstance.patch<{
        message: string;
        data: { unreadCount: number };
      }>(APP_ROUTES.NOTIFICATIONS.MARK_AS_READ(notificationId));
      dispatch(markAsReadAction(notificationId));
    } catch (error: any) {
      const message =
        error.response?.data?.messsage ||
        FEEDBACK_MESSAGES.NOTIFICATIONS.ERROR.MARK_AS_READ;
      toast.error(message);
      console.error(message, error);
    }
  }, []);

  const sendNotification = useCallback(
    async (data: {
      recipientId: string;
      title: string;
      message: string;
      bookingId?: string;
    }) => {
      try {
        const response = await axiosInstance.post<{
          message: string;
          data: INotification;
        }>(APP_ROUTES.NOTIFICATIONS.CREATE, data);
        toast.success(FEEDBACK_MESSAGES.NOTIFICATIONS.SUCCESS.SEND);

        return response.data.data;
      } catch (error: any) {
        const message =
          error.response?.data?.messsage ||
          FEEDBACK_MESSAGES.NOTIFICATIONS.ERROR.SEND;
        toast.error(message);
        console.error(message, error);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await axiosInstance.patch(APP_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
      dispatch(markAllAsReadAction());
    } catch (error: any) {
      const message =
        error.response?.data?.messsage ||
        FEEDBACK_MESSAGES.NOTIFICATIONS.ERROR.MARK_ALL_AS_READ;
      toast.error(message);
      console.error(message, error);
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      await axiosInstance.delete(APP_ROUTES.NOTIFICATIONS.CLEAR_ALL);
      dispatch(clearNotifications());
    } catch (error: any) {
      const message =
        error.response?.data?.messsage ||
        FEEDBACK_MESSAGES.NOTIFICATIONS.ERROR.CLEAR_ALL;
      toast.error(message);
      console.error(message, error);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    connectSocket()
    const socket = getSocket();
    const handleNewNotification = (notification: INotification) => {

      dispatch(addNotification(notification));
    };
    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [currentUser?.id, dispatch]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    sendNotification,
    clearAllNotifications,
    markAllAsRead,
  };
};
