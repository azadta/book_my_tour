import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface INotification {
  _id: string;
  recipientId: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  message: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: INotification[];
        unreadCount: number;
      }>,
    ) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {

      const exists = state.notifications.some(
        (n) => n._id === action.payload._id,
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload,
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  clearNotifications,
  markAllAsRead,
  markAsRead,
  setNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
