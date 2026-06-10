import express from "express";
import { commonAuthController } from "../config/container";
import { ROUTES } from "../constants/routesConstants";
const router = express.Router();

router.post(ROUTES.COMMON.REFRESH, commonAuthController.refresh);

export default router;
