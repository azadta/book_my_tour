import { body, validationResult, ValidationChain } from "express-validator";
import { CustomError } from "../utils/customError";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { RESPONSE_MESSAGES } from "../constants/messages";

export const validateUpdateUser: (ValidationChain | RequestHandler)[] = [
  body("name").optional().isString().withMessage("Name must be string"),

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
  body("mobile")
    .optional({ checkFalsy: true })
    .matches(/^\d{10,}$/)
    .withMessage("Mobile must be at least 10 digits and contain only numbers"),

  body("isPremium")
    .optional()
    .isBoolean()
    .withMessage("isPremium must be true or false"),
  body("coinsEarned")
    .optional()
    .isInt({ min: 0 })
    .withMessage("coinsEarned must be a non negative number"),
  body("referralCode")
    .optional()
    .isString()
    .withMessage("referralCode must be a string"),
  body("referredBy")
    .optional()
    .isString()
    .withMessage("refferedBy must be a string"),
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
