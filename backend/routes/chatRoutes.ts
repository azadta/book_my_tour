import express from "express";
import { ROUTES } from "../constants/routesConstants";
import { authMiddleware, chatController } from "../config/container";

const router = express.Router();

router.get(
  ROUTES.CHAT.MY_CHATS,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.getMyChats,
);
router.post(
  ROUTES.CHAT.ACCESS_CHAT,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.accessChat,
);
router.get(
  ROUTES.CHAT.CHAT_MESSAGES,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.getChatMessages,
);
router.delete(
  ROUTES.CHAT.CLEAR_MESSAGES,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.clearChat,
);
export default router;
