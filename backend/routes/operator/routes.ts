import express from "express";
import { adminRouter } from "./adminRoutes";
import { operatorRouter } from "./operatorRoutes";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/", operatorRouter);

export default router;
