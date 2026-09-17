import express from "express";

import { operatorRouter } from "./operatorRoutes";
import { adminRouter } from "./adminRoutes";
const router = express.Router();

router.use("/", operatorRouter);
router.use("/admin", adminRouter);

export default router;
