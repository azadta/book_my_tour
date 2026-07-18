import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";
import { RESPONSE_MESSAGES } from "../constants/messages";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    logger.error(err.message, {
      status: err.statusCode,
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
      user: req.user,
    });
    console.error("💥 Stack Trace:", err.stack);
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }
  if (err instanceof Error) {
    logger.error(err.message, {
      status: 500,
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
      user: req.user,
    });
    console.error("💥 Stack Trace:", err.stack);
    return res
      .status(500)
      .json({ success: false, statusCode: 500, message: err.message });
  }

  logger.error("Unknown Error", {
    status: 500,
    method: req.method,
    url: req.originalUrl,

    user: req.user,
  });

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: RESPONSE_MESSAGES.AUTH.ERROR.SERVER_ERROR,
  });
};

export default errorHandler;
