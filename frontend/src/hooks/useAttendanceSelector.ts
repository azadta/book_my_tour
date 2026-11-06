import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { handleApiError } from "@/utils/axiosErrorHandler";
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
        APP_ROUTES.BOOKINGS.OPERATOR.ATTENDANCE(bookingId),
        { attendance: newStatus },
      );
      setStatus(newStatus);
      toast.success(
        FEEDBACK_MESSAGES.BOOKING.SUCCESS.UPDATE_GUEST_STATUS(newStatus),
      );
      if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, status, handleStatusChange };
};
