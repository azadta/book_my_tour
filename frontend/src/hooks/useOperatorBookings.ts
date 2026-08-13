import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IPopulatedBooking } from "@/interfaces/interfaces";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useOperatorBookings = (
  page: number,
  limit: number,
  statusFilter?: string,
) => {
  const [bookings, setBookings] = useState<IPopulatedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCancelCount, setPendingCancelCount] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingRes, statsRes] = await Promise.all([
        axiosInstance.get(APP_ROUTES.OPERATOR.BOOKINGS, {
          params: { page, limit, status: statusFilter || undefined },
        }),
        axiosInstance.get(APP_ROUTES.OPERATOR.DASHBOARD_DATA),
      ]);
      setBookings(bookingRes.data.bookings || []);
      setTotalCount(bookingRes.data.totalCount || 0);
      setPendingCancelCount(statsRes.data.cancelRequestedBookings || 0);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.BOOKING.ERROR.FETCH_OPERATOR_BOOKINGS;
      (toast.error(message), console.error(message, error));
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    totalCount,
    refetch: fetchBookings,
    pendingCancelCount,
  };
};
