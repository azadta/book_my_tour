import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./config/database";
import errorHandler from "./middlewares/errorHandler";
import { morganMiddleware } from "./middlewares/morgan";
import adminRouter from "./routes/adminRoutes";
import commonAuthRouter from "./routes/commonAuthRoutes";
import webhookRouter from "./routes/webhookRoutes";
import operatorRouter from "./routes/operatorRoutes";
import userRouter from "./routes/userRoutes";
import chatRouter from "./routes/chatRoutes";
import { socketService } from "./config/container";
import { createServer } from "node:http";

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


app.use("/api/user", userRouter);
app.use("/api/operator", operatorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", commonAuthRouter);
app.use("/api/v1", webhookRouter);
app.use("/api/chat", chatRouter);
app.use(errorHandler);

const httpServer = createServer(app);
socketService.init(httpServer);
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
