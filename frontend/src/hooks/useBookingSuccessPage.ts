import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IBookingResponse } from "@/interfaces/interfaces";
import { useState } from "react";
import { toast } from "react-toastify";

export const useBookingSuccessPage = () => {
  const [booking, setBooking] = useState<IBookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookingDetails = async (orderId:string) => {
    try {
      if (orderId) {
        setIsLoading(true);
        const response = await axiosInstance.get(
          APP_ROUTES.USER.BOOKING_BY_ORDER_ID(orderId),
        );
        setBooking(response.data);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.BOOKING.ERROR.FETCH;
      toast.error(message);
      console.error(message, error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchBookingDetails, isLoading, booking };
};
