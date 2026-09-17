import express from "express";

import { operatorRouter } from "./operatorRoutes";
import { userRouter } from "./userRoutes";
const router = express.Router();

router.use("/operator", operatorRouter);
router.use("/", userRouter);

export default router;
