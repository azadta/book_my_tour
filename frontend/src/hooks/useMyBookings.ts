import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IPricing } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface PopulatedDestinations {
  _id: string;
  name: string;
}

export interface PopulatedPackage {
  _id: string;
  name: string;
  destinations: PopulatedDestinations[];
  duration: { day: number; night: number };
  images?: string[];
  amount: number;
  startDate:string
}

export interface IBooking {
  _id: string;
  packageId: PopulatedPackage;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  pricing: IPricing;
  addedActivityIds: string[];
  removedActivityIds: string[];
  status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED" | "CANCEL_REQUESTED";
  createdAt: string;
}

export const useMyBookings = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(APP_ROUTES.USER.MY_BOOKINGS);
      setBookings(response.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.BOOKING.ERROR.FETCH_USER_BOOKINGS;
      toast.error(message);
      console.error(message, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCancelModel = (bookingId: string) => {
    (setSelectedBookingId(bookingId), setCancelReason(""));
  };
  const handleCloseModal = () => {
    setSelectedBookingId(null);
    setCancelReason("");
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    setIsCancelling(true);
    try {
      const res = await axiosInstance.post(
        APP_ROUTES.USER.CANCEL_BOOKING(selectedBookingId),{reason:cancelReason.trim()}
      );
      toast.success(res.data?.message);
      handleCloseModal();

      fetchBookings();
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.BOOKING.ERROR.CANCEL;
      toast.error(message);
      console.error(message, error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    isLoading,
    refetch: fetchBookings,
    handleCancelBooking,
    selectedBookingId,
    cancelReason,
    handleCloseModal,
    setCancelReason,
    isCancelling,

    handleOpenCancelModel,
  };
};
