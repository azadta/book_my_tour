import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { useState } from "react";
import { toast } from "react-toastify";

export const useAttendanceSelector = (
  currentAttendance: string,
  bookingId: string,
  onUpdate: () => void,
) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentAttendance);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await axiosInstance.patch(
        APP_ROUTES.OPERATOR.UPDATE_GUEST_ATTENDANCE(bookingId),
        { attendance: newStatus },
      );
      setStatus(newStatus);
      toast.success(
        FEEDBACK_MESSAGES.BOOKING.SUCCESS.UPDATE_GUEST_STATUS(newStatus),
      );
      if (onUpdate) onUpdate();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.BOOKING.ERROR.UPDATE_ATTENDANCE;
      toast.error(message);
      console.error(message, error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, status, handleStatusChange };
};
