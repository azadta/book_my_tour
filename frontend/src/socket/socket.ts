import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let isRefreshingSocket = false;
const SOCKET_URL = "http://localhost:4000";

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socket.on("connect_error", async (err) => {
      console.error("Socket connection error", err.message);
      if (err.message === "unAuthorized" || err.message === "TOKEN_EXPIRED") {
        if (!isRefreshingSocket) {
          isRefreshingSocket = true;
          try {
            await axiosInstance.post(APP_ROUTES.COMMON_AUTH.REFRESH_TOKEN);
            socket?.connect();
          } catch (refreshError) {
            console.error("Socket auth refresh failed", refreshError);
          } finally {
            isRefreshingSocket = false;
          }
        }
      }
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
