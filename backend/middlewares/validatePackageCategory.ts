import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError.js";

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
      const firstError = errors.array()[0];
      return next(new CustomError(firstError.msg, 400));
    }
    next();
  },
];
