import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError.js";

export const validateDestination: (ValidationChain | RequestHandler)[] = [
  body("name")
    .notEmpty()
    .withMessage("Destination name is required")
    .isString()
    .withMessage("Destination must be string")
    .trim(),
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
      const firstError = errors.array()[0];
      return next(new CustomError(firstError!.msg, 400));
    }
    next();
  },
];
