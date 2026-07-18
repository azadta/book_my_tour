import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";

export const validatePackageCategory: (ValidationChain | RequestHandler)[] = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be string")
    .trim(),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedError: Record<string, string> = {};
      errors.array().forEach((err) => {
        if (err.type === "field") {
          formattedError[err.path] = err.msg;
        }
      });
      return next(
        new CustomError(
          RESPONSE_MESSAGES.VALIDATION.ERROR.VALIDATION_ERROR,
          400,
          formattedError,
        ),
      );
    }
    next();
  },
];
