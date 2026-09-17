import express from "express";
import { adminRouter } from "./adminRoutes";

import { publicRouter } from "./publicRoutes";
const router = express.Router();

router.use("/admin", adminRouter);
router.use("/", publicRouter);

export default router;
