import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
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
}

export interface Booking {
  _id: string;
  packageId: PopulatedPackage;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  totalAmount: number;
  addedActivityIds?: string[];
  removedActivityIds?: string[];
  status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";
  createdAt: string;
}

export const useMyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, isLoading, refetch: fetchBookings };
};
