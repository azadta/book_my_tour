import express from "express";

import { userRouter } from "./userRoutes";
import { managementRouter } from "./managementRoutes";
const router = express.Router();

router.use("/user", userRouter);
router.use("/", managementRouter);

export default router;
