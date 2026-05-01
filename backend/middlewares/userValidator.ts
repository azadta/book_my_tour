import { body, ValidationChain, validationResult } from "express-validator";

import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants.js";
import { CustomError } from "../utils/customError.js";

export const validateUser: (ValidationChain | RequestHandler)[] = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Password must contain at least one special character (!@#$...)",
    ),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be true or false"),

  body("coinsEarned")
    .optional()
    .isInt({ min: 0 })
    .withMessage("coinsEarned must be a non-negative integer"),

  body("refferalCode")
    .optional()
    .isString()
    .withMessage("Referral code must be a string"),

  body("refferedBy")
    .optional()
    .isString()
    .withMessage("Referred by must be a string"),

    (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let formattedError: Record<string, string> = {};
      errors.array().forEach((err) => {
        if (err.type === "field") {
          formattedError[err.path] = err.msg;
        }
      });
      return next(new CustomError("Validation Error", 400, formattedError));
    }
    next();
  },
];
