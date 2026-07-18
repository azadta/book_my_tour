import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";

export const validateDestination: (ValidationChain | RequestHandler)[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Destination name is required")
    .isString()
    .withMessage("Destination must be string"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be number between -90 to 90"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be number between -180 to 180"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("Images must be a non empty array of URLs"),
  body("images.*")
    .isString()
    .withMessage("Each image  must be string URL")
    .isURL()
    .withMessage("Each image must be a valid URL"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedError: Record<string, string> = {};
      errors.array().forEach((err) => {
        if (err.type === "field") {
          formattedError[err.path] = err.msg;
        }
      });
      return next(new CustomError(RESPONSE_MESSAGES.VALIDATION.ERROR.VALIDATION_ERROR, 400, formattedError));
    }
    next();
  },
];
