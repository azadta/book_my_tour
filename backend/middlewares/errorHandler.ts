import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { sendErrorResponse } from "../utils/apiResponse";

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
    return sendErrorResponse(res, err.message, err.statusCode, err.errors);
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
  } else {
    logger.error("Unknown Error", {
      status: 500,
      method: req.method,
      url: req.originalUrl,

      user: req.user,
    });
    console.error("💥 Unknown error:", err);
  }

  return sendErrorResponse(res, RESPONSE_MESSAGES.AUTH.ERROR.SERVER_ERROR, 500);
};

export default errorHandler;
