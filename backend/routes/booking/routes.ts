import express from "express";
import { adminRouter } from "./adminRoutes";
import { operatorRouter } from "./operatorRoutes";
import { userRouter } from "./userRoutes";
const router = express.Router();

router.use("/admin", adminRouter);
router.use("/operator", operatorRouter);
router.use("/", userRouter);

export default router;
