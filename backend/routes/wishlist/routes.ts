import express from "express";

import { userRouter } from "./userRoutes";
import { publicRouter } from "./publicRoutes";
const router = express.Router();

router.use("/user", userRouter);
router.use("/", publicRouter);

export default router;
