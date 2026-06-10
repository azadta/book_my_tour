import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { CustomError } from "../utils/customError";

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
  console.error("💥 Stack Trace:", err.stack);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors,
  });
};

export default errorHandler;
