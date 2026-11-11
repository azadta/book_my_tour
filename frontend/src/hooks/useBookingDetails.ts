import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { IBookingDetails } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useState } from "react";

export const useBookingDetails = () => {
  const [booking, setBooking] = useState<IBookingDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBookingDetails = useCallback(async (bookingId: string) => {
    try {
      setIsLoading(true);
      if (bookingId) {
        const { data } = await axiosInstance.get(
          APP_ROUTES.BOOKINGS.USER.BOOKING_DETAILS(bookingId),
        );
        setBooking(data.result);
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      if (errorMessage) setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchUserBookingDetails, isLoading, booking, error };
};
