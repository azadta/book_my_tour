import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, uploadController } from "../../config/container";

const router = express.Router();

router.post(
  ROUTES.UPLOAD.PRESIGN,
  authMiddleware.verifyRole("admin", "operator", "user"),
  uploadController.createPresignedUrl,
);

export default router;
