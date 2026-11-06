import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { IBookingResponse } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useState } from "react";

export const useBookingSuccessPage = () => {
  const [booking, setBooking] = useState<IBookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookingDetails = useCallback(async (orderId: string) => {
    try {
      if (orderId) {
        setIsLoading(true);
        const response = await axiosInstance.get(
          APP_ROUTES.BOOKINGS.USER.BY_ORDER_ID(orderId),
        );
        setBooking(response.data.result);
      }
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  },[])

  return { fetchBookingDetails, isLoading, booking };
};
