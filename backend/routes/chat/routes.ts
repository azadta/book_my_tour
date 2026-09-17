import express from "express";
import { authMiddleware, chatController } from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const router = express.Router();

router.get(
  ROUTES.CHATS.ANY.MY_CHATS,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.getMyChats,
);
router.post(
  ROUTES.CHATS.ANY.ACCESS_CHAT,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.accessChat,
);
router.get(
  ROUTES.CHATS.ANY.CHAT_MESSAGES,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.getChatMessages,
);
router.delete(
  ROUTES.CHATS.ANY.CLEAR_MESSAGES,
  authMiddleware.verifyRole("user", "operator", "admin"),
  chatController.clearChat,
);

export default router;
