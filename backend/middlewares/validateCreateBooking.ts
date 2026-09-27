import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { error } from "node:console";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";

export const validateCreateBooking: (ValidationChain | RequestHandler)[] = [
  body("packageId")
    .notEmpty()
    .withMessage("Package ID is required")
    .isMongoId()
    .withMessage("Package ID must be a valid Mongo ID"),
  body("adultCount")
    .notEmpty()
    .withMessage("Adult count is required")
    .isInt({ min: 1 })
    .withMessage("Adult count must be atleast 1"),
  body("childCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Child count must be a non-negative integer"),
  body("primaryContact")
    .isObject()
    .withMessage("Primary contact details are required"),
  body("primaryContact.name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),
  body("primaryContact.email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("primaryContact.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone number must be a string"),
  body("members")
    .isArray({ min: 1 })
    .withMessage("Members list must contain atleast one traveller"),
  body("members.*.type")
    .notEmpty()
    .withMessage("Traveler type is required")
    .isIn(["adult", "child"])
    .withMessage("Traveler type must be either 'child' or 'adult'"),
  body("members.*.firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string"),
  body("members.*.lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string"),
  body("members.*.dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("members.*.gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be 'male', 'female', 'other'"),
  body("members.*.passportNumber")
    .optional()
    .isString()
    .withMessage("Passport number must be a string"),
  body("addedActivityIds")
    .optional()
    .isArray()
    .withMessage("Added activity IDs must be an array"),
  body("addedActivityIds.*.")
    .optional()
    .isString()
    .withMessage("Each added activity Ids must be a string"),
  body("removedActivityIds")
    .optional()
    .isArray()
    .withMessage("Removed activity IDs must be an array"),
  body("removedActivityIds.*.")
    .optional()
    .isString()
    .withMessage("Each removed activity Ids must be a string"),
  body("generalCouponCode")
    .optional({nullable:true})
    .isString()
    .withMessage("General coupon code must be a string"),
  body("bankCouponCode")
    .optional({nullable:true})
    .isString()
    .withMessage("Bank coupon code must be a string"),
  body("isWalletApplied")
    .optional()
    .isBoolean()
    .withMessage("isWalletApplied must be a boolean value"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedError: Record<string, string> = {};
      errors.array().forEach((err) => {
        if (err.type === "field") {
          const standardizedPath = err.path.replace(/\[(\d+)\]/g, ".$1");
          formattedError[standardizedPath] = err.msg;
        }
      });
      return next(
        new CustomError(
          RESPONSE_MESSAGES.VALIDATION.ERROR.VALIDATION_ERROR,
          StatusCode.BAD_REQUEST,
          formattedError,
        ),
      );
    }
    next();
  },
];
