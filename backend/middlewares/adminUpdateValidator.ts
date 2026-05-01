import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { CustomError } from "../utils/customError.js";

export const validateUpdateAdmin: (ValidationChain | RequestHandler)[] = [
  body("name").optional().isString().withMessage("Name must be a string"),

  body("email").optional().isEmail().withMessage("Invalid email address"),

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
      "Password must contain at least one special character (!@#$...)",
    ),
  body("image").optional().isURL().withMessage("Image must be a valid URL"),

  body("address.houseNo")
    .optional()
    .isString()
    .withMessage("House number must be a string"),

  body("address.landmark")
    .optional()
    .isString()
    .withMessage("Landmark must be a string"),

  body("address.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),

  body("address.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),

  body("address.country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),

  body("address.postalCode")
    .optional({ checkFalsy: true })
    .isPostalCode("any")
    .withMessage("Invalid postal code"),

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
