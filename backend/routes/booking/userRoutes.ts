import express from "express";
import {
    authMiddleware,
    bookingController
} from "../../config/container";
import { ROUTES } from "../../constants/routesConstants";

const userRouter = express.Router();

userRouter.post(
  ROUTES.BOOKINGS.USER.CREATE,
  authMiddleware.verifyRole("user"),
  bookingController.createBookingOrder,
);
userRouter.post(
  ROUTES.BOOKINGS.USER.PAYMENT_VERIFY,
  authMiddleware.verifyRole("user"),
  bookingController.verifyBookingPayment,
);

userRouter.get(
  ROUTES.BOOKINGS.USER.MY_BOOKINGS,
  authMiddleware.verifyRole("user"),
  bookingController.getUserBookings,
);
userRouter.post(
  ROUTES.BOOKINGS.USER.CANCEL,
  authMiddleware.verifyRole("user"),
  bookingController.cancelBooking,
);
userRouter.get(
  ROUTES.BOOKINGS.USER.BY_ORDER_ID,
  authMiddleware.verifyRole("user"),
  bookingController.findBookingByOrderId,
);

export { userRouter };

