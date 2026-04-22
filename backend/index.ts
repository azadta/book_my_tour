import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";
import operatorRouter from "./routes/operatorRoutes";
import adminRouter from "./routes/adminRoutes.js";
import commonAuthRouter from "./routes/commonAuthRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { morganMiddleware } from "./middlewares/morgan.js";

mongoose
  .connect(process.env.MONGO as string)
  .then((conn) => console.log(`Mongodb connected: ${conn.connection.host}`))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const app = express();
const PORT = 4000;
app.use(
  cors({
    origin: "http//:localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware)
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use("/api/user", userRouter);
app.use("/api/operator", operatorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", commonAuthRouter);
app.use(errorHandler);
