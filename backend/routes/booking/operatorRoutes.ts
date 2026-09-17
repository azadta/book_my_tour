import express from "express";
import { ROUTES } from "../../constants/routesConstants";
import { authMiddleware, bookingController } from "../../config/container";

const operatorRouter = express.Router();

operatorRouter.get(
  ROUTES.BOOKINGS.OPERATOR.LIST,
  authMiddleware.verifyRole("operator"),
  bookingController.getOperatorBookings,
);
operatorRouter.get(
  ROUTES.BOOKINGS.OPERATOR.DETAILS,
  authMiddleware.verifyRole("operator"),
  bookingController.getOperatorBookingDetails,
);
operatorRouter.patch(
  ROUTES.BOOKINGS.OPERATOR.ATTENDANCE,
  authMiddleware.verifyRole("operator"),
  bookingController.updateGuestAttendance,
);
operatorRouter.patch(
  ROUTES.BOOKINGS.OPERATOR.RESCHEDULE,
  authMiddleware.verifyRole("operator"),
  bookingController.operatorRescheduleBooking,
);
operatorRouter.post(
  ROUTES.BOOKINGS.OPERATOR.CANCEL,
  authMiddleware.verifyRole("operator"),
  bookingController.operatorCancelBooking,
);
operatorRouter.post(
  ROUTES.BOOKINGS.OPERATOR. VERIFY_CANCELLATION,
  authMiddleware.verifyRole("operator"),
  bookingController.verifyCancellationRequest,
);


export { operatorRouter };
