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
import { handleApiError } from "@/utils/axiosErrorHandler";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification,
  );

  const [loading, setLoading] = useState<boolean>(false);
  const userId=currentUser?.id

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get<{
        result: { notifications: INotification[]; unreadCount: number };
      }>(APP_ROUTES.NOTIFICATIONS.ANY.USER_NOTIFICATIONS);
      dispatch(
        setNotifications({
          notifications: response.data.result.notifications || [],
          unreadCount: response.data.result.unreadCount || 0,
        }),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await axiosInstance.patch<{
          message: string;
          data: { unreadCount: number };
        }>(APP_ROUTES.NOTIFICATIONS.USER.MARK_AS_READ(notificationId));
        dispatch(markAsReadAction(notificationId));
      } catch (error) {
        handleApiError(error);
      }
    },
    [dispatch],
  );

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
          result: INotification;
        }>(APP_ROUTES.NOTIFICATIONS.ANY.CREATE, data);
        toast.success(FEEDBACK_MESSAGES.NOTIFICATIONS.SUCCESS.SEND);

        return response.data.result;
      } catch (error) {
        handleApiError(error);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await axiosInstance.patch(APP_ROUTES.NOTIFICATIONS.USER.MARK_ALL_AS_READ);
      dispatch(markAllAsReadAction());
    } catch (error) {
      handleApiError(error);
    }
  }, [dispatch]);

  const clearAllNotifications = useCallback(async () => {
    try {
      await axiosInstance.delete(APP_ROUTES.NOTIFICATIONS.USER.CLEAR_ALL);
      dispatch(clearNotifications());
    } catch (error) {
      handleApiError(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser) return;
    connectSocket();
    const socket = getSocket();
    const handleNewNotification = (notification: INotification) => {
      dispatch(addNotification(notification));
    };
    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [currentUser, dispatch]);

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
