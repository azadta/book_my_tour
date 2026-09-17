import express from "express";

import { userRouter } from "./userRoutes";
import { publicRouter } from "./publicRoutes";
const router = express.Router();

router.use("/", publicRouter);
router.use("/user", userRouter);

export default router;
