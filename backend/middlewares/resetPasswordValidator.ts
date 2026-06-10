import { body, validationResult, ValidationChain } from "express-validator";
import { CustomError } from "../utils/customError";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const resetPasswordValidator: (ValidationChain | RequestHandler)[] = [
    
  body("newPassword")
    .notEmpty()
    .withMessage("Password should not be empty")
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
