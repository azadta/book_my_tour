import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError.js";

export const validatePackage: (ValidationChain | RequestHandler)[] = [
  body("name")
    .notEmpty()
    .withMessage("Package name is required")
    .isString()
    .withMessage("Pakage name must be a string"),
  body("amount")
    .notEmpty()
    .withMessage("Package amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a non negative number"),
  body("destinations")
    .isArray({ min: 1 })
    .withMessage("Destinations must be a non empty array of objectIds"),
  body("destinations.*")
    .isMongoId()
    .withMessage("Each destination must be a valid mongo Id"),
  body("specifications")
    .optional()
    .isString()
    .withMessage("Specifications must be a string"),
  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("Expiry date must be valid date"),
  body("remark")
    .optional()
    .isString()
    .withMessage("Remark must be valid string"),
  body("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be non negative number"),
  body("availableSlots")
    .optional()
    .isString()
    .withMessage("available slots must be a string"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("images must be a non empty array of URLs"),
  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),
  body("isCustomizable")
    .optional()
    .isBoolean()
    .withMessage("isCustomizable must be true or false"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid mongo Id"),
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
