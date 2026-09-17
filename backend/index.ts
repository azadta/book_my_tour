import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { socketService } from "./config/container";
import { connectDb } from "./config/database";
import errorHandler from "./middlewares/errorHandler";
import { morganMiddleware } from "./middlewares/morgan";
import bookingRouter from "./routes/booking/routes";
import packageRouter from "./routes/package/routes";
import userRouter from "./routes/user/routes";
import packageCategoryRouter from "./routes/package-category/routes";
import packageDestinationRouter from "./routes/package-destination/routes";
import wishlistRouter from "./routes/wishlist/routes";
import packageReviewRouter from "./routes/package-review/routes";
import chatRouter from "./routes/chat/routes";
import notificationRouter from "./routes/notification/routes";
import adminRouter from "./routes/admin/routes";
import dashboardRouter from "./routes/dashboard/routes";
import commonAuthRouter from "./routes/common-authentication/routes";
import walletRouter from "./routes/wallet/routes";
import operatorRouter from "./routes/operator/routes";
import couponRouter from "./routes/coupon/routes";

dotenv.config();

const app = express();
const PORT = 4000;
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);
connectDb();

app.use("/api/booking", bookingRouter);
app.use("/api/package", packageRouter);
app.use("/api/user", userRouter);
app.use("/api/operator", operatorRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/package-category", packageCategoryRouter);
app.use("/api/package-destination", packageDestinationRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/package-review", packageReviewRouter);
app.use("/api/chat", chatRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", commonAuthRouter);
app.use(errorHandler);

const httpServer = createServer(app);
socketService.init(httpServer);
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
