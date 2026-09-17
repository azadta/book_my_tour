import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, bookingController } from "../../config/container";

const adminRouter = express.Router();

adminRouter.get(
  ROUTES.BOOKINGS.ADMIN.CANCELLATION_REQUESTS,
  authMiddleware.verifyRole("admin"),
  bookingController.getPendingCancellations,
);
adminRouter.patch(
  ROUTES.BOOKINGS.ADMIN.PROCESS_CANCELLATION,
  authMiddleware.verifyRole("admin"),
  bookingController.processCancellationRequests,
);

export { adminRouter };
