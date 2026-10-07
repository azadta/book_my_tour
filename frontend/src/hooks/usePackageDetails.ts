import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type {
  IPackageItem,
  IReviewItem,
  IReviewStats,
} from "@/interfaces/interfaces";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { unFlattenObject } from "../../../backend/utils/unFlattenObject";

export const usePackageDetails = (packageId: string) => {
  const [pkg, setPkg] = useState<IPackageItem | null>(null);
  const [packageLoading, setPackageLoading] = useState<boolean>(true);
  const [reviewLoading,setReviewLoading]=useState(false)
  const [reviewStats, setReviewStats] = useState<IReviewStats | null>(null);
  const [reviews, setReviews] = useState<IReviewItem[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<IReviewItem | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const fetchPackage = async () => {
    setPackageLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGES.USER.DETAIL(packageId),
      );

      setPkg(data);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setPackageLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGE_REVIEWS.PUBLIC.LIST_BY_PACKAGE_ID(packageId),
      );

      setReviews(data.reviews);
      setReviewStats(data.stats);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.REVIEWS.ERROR, error);
    } finally {
      setReviewLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingReview(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (editPayload: any) => {
    setEditingReview(editPayload);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(undefined);
  };

  const createReview = async (data: any) => {
    setSubmittingReview(true);
    try {
      const imageFiles = data.images ?? [];
      const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);

      const updatedData = {
        ...unFlattenObject(data),
        images: uploadedImageUrls,
      };
      await axiosInstance.post(
        APP_ROUTES.PACKAGE_REVIEWS.USER.CREATE(packageId),
        updatedData,
      );
      fetchReviews();
      toast.success(FEEDBACK_MESSAGES.REVIEWS.SUCCESS.CREATE);
      closeModal();
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.REVIEWS.ERROR.CREATE;
      toast.error(message);
      console.error(message, error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const updateReview = async (reviewId: string, data: any) => {
    const categoryRatings = {
      guide: data?.categoryRatings?.guide ?? data["categoryRatings.guide"] ?? 5,
      value: data?.categoryRatings?.value ?? data["categoryRatings.value"] ?? 5,
      itinerary:
        data?.categoryRatings?.itinerary ??
        data["categoryRatings.itinerary"] ??
        5,
      transport:
        data?.categoryRatings?.transport ??
        data["categoryRatings.transport"] ??
        5,
    };

    setSubmittingReview(true);
    try {
      const existingUrls = (data.images ?? []).filter(
        (img: any) => typeof img === "string",
      );
      const newFiles = (data.images ?? []).filter(
        (img: any) => typeof img !== "string",
      );
      const uploadedImageUrls =
        newFiles.length > 0
          ? ((await uploadImagesToCloudinary(newFiles)) ?? [])
          : [];

      const payload = {
        _id: data._id,
        rating: data.rating,
        comment: data.comment,
        travelerType: data.travelerType,
        categoryRatings,

        images: [...existingUrls, ...uploadedImageUrls],
      };

      await axiosInstance.put(
        APP_ROUTES.PACKAGE_REVIEWS.USER.UPDATE(reviewId, packageId),
        payload,
      );
      toast.success(FEEDBACK_MESSAGES.REVIEWS.SUCCESS.UPDATE);
      closeModal();
      fetchReviews();
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.REVIEWS.ERROR.UPDATE;
      toast.error(message);
      console.error(message, error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const saveReview = async (payload: any) => {
    if (editingReview) {
      await updateReview(editingReview._id, payload);
    } else [await createReview(payload)];
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await axiosInstance.delete(
        APP_ROUTES.PACKAGE_REVIEWS.USER.DELETE(reviewId, packageId),
      );
      toast.success(FEEDBACK_MESSAGES.REVIEWS.SUCCESS.DELETE);
      fetchReviews();
    } catch (error: any) {
      const message =
        error.response?.data?.message || FEEDBACK_MESSAGES.REVIEWS.ERROR.DELETE;
      toast.error(message);
      console.error(message, error);
    }
  };

  useEffect(() => {
    fetchPackage();
    fetchReviews();
  }, [packageId]);

  return {
    pkg,
    packageLoading,
    reviewLoading,
    reviewStats,
    reviews,
    isModalOpen,
    submittingReview,
    updateReview,
    deleteReview,
    editingReview,
    setEditingReview,
    openCreateModal,
    openEditModal,
    closeModal,
    saveReview,
    isBookingLoading,
  };
};
