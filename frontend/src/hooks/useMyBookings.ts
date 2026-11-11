import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { IPricing } from "@/interfaces/interfaces";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { unFlattenObject } from "../../../backend/utils/unFlattenObject";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

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
  startDate: string;
  operatorId:string
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

export const useMyBookings = (
  currentPage: number,
  resultPerPage: number = 5,
) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeBookingForReview, setActiveBookingForReview] =
    useState<IBooking | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${APP_ROUTES.BOOKINGS.USER.MY_BOOKINGS}?page=${currentPage}&limit=${resultPerPage}`,
      );

      setBookings(response.data.result.bookings);
      setTotalCount(response.data.result.totalCount);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, resultPerPage]);
  const handleOpenCancelModel = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancelReason("");
  };
  const handleCloseModal = () => {
    setSelectedBookingId(null);
    setCancelReason("");
  };
  const openCreateModal = (booking: IBooking) => {
    setActiveBookingForReview(booking);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setActiveBookingForReview(null);
  };
  const createReview = async (data: Record<string, unknown>) => {
    const packageId = activeBookingForReview?.packageId._id as string
    setSubmittingReview(true);
    try {
      const rawFiles = (data.images ?? []) as unknown[];
      const imageFiles = rawFiles.filter(
        (img): img is File => img instanceof File,
      );
      const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);

      const updatedData = {
        ...unFlattenObject(data),
        images: uploadedImageUrls,
      };
      await axiosInstance.post(
        APP_ROUTES.PACKAGE_REVIEWS.USER.CREATE(packageId),
        updatedData,
      );

      toast.success(FEEDBACK_MESSAGES.REVIEWS.SUCCESS.CREATE);
      closeModal();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    setIsCancelling(true);
    try {
      const res = await axiosInstance.post(
        APP_ROUTES.BOOKINGS.USER.CANCEL(selectedBookingId),
        { reason: cancelReason.trim() },
      );
      toast.success(res.data?.message);
      handleCloseModal();

      fetchBookings();
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, fetchBookings]);

  return {
    bookings,
    totalCount,
    isLoading,
    refetch: fetchBookings,
    handleCancelBooking,
    selectedBookingId,
    cancelReason,
    handleCloseModal,
    setCancelReason,
    isCancelling,
    handleOpenCancelModel,
    isModalOpen,
    submittingReview,
    openCreateModal,
    closeModal,
    createReview,
  };
};
