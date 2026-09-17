import express from "express";
import { adminRouter } from "./adminRoutes";

import { userRouter } from "./userRoutes";
const router = express.Router();

router.use("/admin", adminRouter);
router.use("/", userRouter);

export default router;
