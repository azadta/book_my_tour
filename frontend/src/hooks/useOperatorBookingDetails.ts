import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IPopulatedBooking } from "@/interfaces/interfaces";
import { useState } from "react";
import { toast } from "react-toastify";

export const useOperatorBookingDetails = () => {
  const [booking, setBooking] = useState<IPopulatedBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [reScheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const fetchDetails = async (bookingId: string) => {
    try {
      const res = await axiosInstance.get(
        APP_ROUTES.OPERATOR.BOOKING_DETAILS(bookingId),
      );

      setBooking(res.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.BOOKING.ERROR.BOOKING_DETAILS;
      toast.error(message);
      console.error(message, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOperatorCancel = async (bookingId: string) => {
    if (!cancelReason.trim()) {
      toast.error(FEEDBACK_MESSAGES.BOOKING.ERROR.CANCEL_REASON_MISSING);
      return;
    }
    try {
      await axiosInstance.post(APP_ROUTES.OPERATOR.CANCEL_BOOKING(bookingId), {
        reason: cancelReason,
      });
      toast.success(FEEDBACK_MESSAGES.BOOKING.SUCCESS.CANCEL);
      setCancelModalOpen(false);
      fetchDetails(bookingId);
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.BOOKING.ERROR.CANCEL;
      toast.error(message);
      console.error(message, error);
    }
  };

  const handleReschedule = async (bookingId: string) => {
    if (!newDate) {
      toast.error(FEEDBACK_MESSAGES.BOOKING.ERROR.DATE_MISSING);
      return;
    }
    try {
      await axiosInstance.patch(
        APP_ROUTES.OPERATOR.RESCHEDULE_BOOKING(bookingId),
        { startDate: newDate },
      );
      toast.success(FEEDBACK_MESSAGES.BOOKING.SUCCESS.RESCHEDULE);
      setRescheduleModalOpen(false);
      fetchDetails(bookingId);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.BOOKING.ERROR.RESCHEDULE;
      toast.error(message);
      console.error(message, error);
    }
  };

  const verifyCancelRequest = async (
    bookingId: string,
    action: "APPROVE" | "REJECT",
  ) => {
    try {
      await axiosInstance.post(APP_ROUTES.OPERATOR.VERIFY_BOOKING(bookingId), {
        action,
      });
      toast.success(
        action === "APPROVE"
          ? FEEDBACK_MESSAGES.BOOKING.SUCCESS.APPROVE_CANCEL_REQ
          : FEEDBACK_MESSAGES.BOOKING.SUCCESS.REJECT_CANCEL_REQ,
      );
      fetchDetails(bookingId as string);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.BOOKING.ERROR.CANCEL_REQ_VERIFICATION;
      toast.error(message);
      console.error(message, error);
    }
  };

  return {
    fetchDetails,
    handleOperatorCancel,
    handleReschedule,
    loading,
    booking,
    setCancelReason,
    setCancelModalOpen,
    cancelModalOpen,
    reScheduleModalOpen,
    setNewDate,
    newDate,
    setRescheduleModalOpen,
    cancelReason,
    verifyCancelRequest,
  };
};
