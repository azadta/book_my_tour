import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  logger.error(message, {
    status: statusCode,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
    user: req.user,
  });
  // console.error("💥 Stack Trace:", err.stack);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorHandler;
