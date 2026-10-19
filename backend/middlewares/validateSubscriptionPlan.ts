import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";

export const validateSubscriptionPlan: (ValidationChain | RequestHandler)[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subscription plan name is required")
    .isString()
    .withMessage("Subscription plan name must be string"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid postive number"),
  body("packageLimit")
    .notEmpty()
    .withMessage("Package limit is required")
    .isInt({ min: 1 })
    .withMessage("Pacakge limit must be a valid integer of at least one"),
  body("durationDays")
    .notEmpty()
    .withMessage("Duration in days is required")
    .isInt({ min: 1 })
    .withMessage("Duration days must be a valid integer of atleat one"),
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
          StatusCode.BAD_REQUEST,
          formattedError,
        ),
      );
    }
    next();
  },
];
