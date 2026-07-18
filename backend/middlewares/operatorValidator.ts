import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";


export const validateOperator: (ValidationChain | RequestHandler)[] = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
,
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
      "Password must contain at least one special character (!@#$...)"
    ),

  body("image").optional().isURL().withMessage("Image must be a valid URL"),
   body("mobile")
    .optional({ checkFalsy: true })
    .matches(/^\d{10,}$/)
    .withMessage("Mobile must be at least 10 digits and contain only numbers"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be true or false"),

  body("referralCode")
    .optional()
    .isString()
    .withMessage("Referral code must be a string"),

  body("referredBy")
    .optional()
    .isString()
    .withMessage("ReferredBy must be a string"),

  body("isEmailVerified")
    .optional()
    .isBoolean()
    .withMessage("isEmailVerified must be true or false"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be true or false"),

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
