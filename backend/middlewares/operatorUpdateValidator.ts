import { body, validationResult, ValidationChain } from "express-validator";
import { CustomError } from "../utils/customError.js";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validateUpdateOperator: (ValidationChain | RequestHandler)[] = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("In valid email format"),
  body("password")
    .optional()
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
  body("image").optional().isURL().withMessage("Image must be a valid Url"),
  body("isBlocked")
    .optional()
    .isBoolean()
    .withMessage("isBlocked must be a boolean"),
  body("mobile")
    .optional({ checkFalsy: true })
    .matches(/^\d{10,}$/)
    .withMessage("Mobile must be at least 10 digits and contain only numbers"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be a boolean"),

  body("referralCode")
    .optional()
    .isString()
    .withMessage("Referral Code must be a string"),

  body("referredBy")
    .optional()
    .isString()
    .withMessage("ReferedBy must be a string"),

  body("isEmailVerified")
    .optional()
    .isBoolean()
    .withMessage("isEmailVerified must be a boolean"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new CustomError(errors.array()[0].msg, 400));
    }
    next();
  },
];
