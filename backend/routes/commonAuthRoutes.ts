import express from "express";
import { commonAuthController } from "../config/container.js";
import { ROUTES } from "../constants/routesConstants.js";
const router = express.Router();

router.post(ROUTES.COMMON.REFRESH, commonAuthController.refresh);

export default router;
