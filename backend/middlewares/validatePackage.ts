import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";

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
  body("childPricing.enabled")
    .optional()
    .isBoolean()
    .withMessage("Child pricing enabled must be true or false"),
  body("childPricing.minAge")
    .if((value, { req }) => req.body['childPricing.enabled'] === true)
    .notEmpty()
    .withMessage("Child minimum age is required")
    .isInt({ min: 0 })
    .withMessage("Child minimum age must be a non-negative integer"),
  body("childPricing.maxAge")
    .if((value, { req }) =>  req.body['childPricing.enabled'] === true)
    .notEmpty()
    .withMessage("Child maximum age is required")
    .isInt({ min: 0 })
    .withMessage("Child maximum age must be a non-negative integer")
    .custom((maxAge, { req }) => {
      const minAge =  req.body['childPricing.minAge']
      if (Number(maxAge) <= Number(minAge)) {
        throw new CustomError(
          "Child maximum age must be greater than minimum age",
          StatusCode.BAD_REQUEST,
        );
      }
      return true;
    }),
  body("childPricing.percentage")
    .if((value, { req }) =>  req.body['childPricing.enabled'] === true)
    .notEmpty()
    .withMessage("Child dicount percentage is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Child discount percentage must be between zero and 100"),

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
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Expiry date must be valid date")
    .custom((value, { req }) => {
      if (req.method === "PUT" || req.method === "PATCH") {
        return true;
      }
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error(`Start date cannot be in the past`);
      }
      return true;
    }),
  body("remark")
    .optional()
    .isString()
    .withMessage("Remark must be valid string"),
  body("discount")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Discount must be non negative number"),
  body("availableSlots")
    .optional()
    .isString()
    .withMessage("available slots must be a string"),
  body("images")
    .isArray({ min: 3 })
    .withMessage("images must be an array with atleast three images"),
  body("images.*").isURL().withMessage("Each image must be a valid URL"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid mongo Id"),
  body("duration.day")
    .notEmpty()
    .withMessage("Duration day is required")
    .isInt({ min: 1 })
    .withMessage("Duration day must be a positive integer"),
  body("duration.night")
    .notEmpty()
    .withMessage("Duration night is required")
    .isInt({ min: 0 })
    .withMessage("Duration night must be a zero or greater"),
  body("itinerary")
    .isArray({ min: 1 })
    .withMessage("Itinerary must contain at least one day"),
  body("itinerary.*.day")
    .isInt({ min: 1 })
    .withMessage("Day must be a positive integer"),
  body("itinerary.*.gallery")
    .isArray({ min: 4 })
    .withMessage("Gallery must be an array with atleast four images"),
  body("itinerary.*.gallery.*")
    .isURL()
    .withMessage("Each gallery image must be a valid url"),
  body("itinerary.*.activities")
    .isArray({ min: 1 })
    .withMessage("Activities must be an array with atleast one activity"),
  body("itinerary.*.activities.*.id")
    .notEmpty()
    .withMessage("Activity id is required"),
  body("itinerary.*.activities.*.name")
    .trim()
    .notEmpty()
    .withMessage("Activity name is required"),

  body("itinerary.*.activities.*.description")
    .trim()
    .notEmpty()
    .withMessage("Activity description is required"),
  body("itinerary.*.activities.*.image")
    .notEmpty()
    .withMessage("Activity image is required")
    .isURL()
    .withMessage("Activity image must be a valid URL"),
  body("itinerary.*.activities.*.timing.from")
    .notEmpty()
    .withMessage("Activity start time is required"),
  body("itinerary.*.activities.*.timing.to")
    .notEmpty()
    .withMessage("Activity end time is required"),
  body("itinerary.*.activities.*.cost")
    .isFloat({ min: 0 })
    .withMessage("Activity cost must be a non negative number"),
  body("itinerary.*.activities.*.customizable")
    .isBoolean()
    .withMessage("Activity customizable must be true or false"),

  body("itinerary.*.optionalActivities")
    .isArray({})
    .withMessage("Optional activities must be an array"),
  body("itinerary.*.optionalActivities.*.id")
    .notEmpty()
    .withMessage("Optional activity id is required"),
  body("itinerary.*.optionalActivities.*.name")
    .trim()
    .notEmpty()
    .withMessage("Optional activity name is required"),
  body("itinerary.*.optionalActivities.*.description")
    .trim()
    .notEmpty()
    .withMessage("Optional activity description is required"),
  body("itinerary.*.optionalActivities.*.image")
    .notEmpty()
    .withMessage("Optional activity image is required")
    .isURL()
    .withMessage("Optional activity image must be a valid URL"),
  body("itinerary.*.optionalActivities.*.timing.from")
    .notEmpty()
    .withMessage("Optional activity start time is required"),
  body("itinerary.*.optionalActivities.*.timing.to")
    .notEmpty()
    .withMessage("Optional activity end time is required"),
  body("itinerary.*.optionalActivities.*.cost")
    .isFloat({ min: 0 })

    .withMessage("Optional activity cost must be a non negative number"),

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
          400,
          formattedError,
        ),
      );
    }
    next();
  },
];
