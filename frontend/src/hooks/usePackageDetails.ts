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

export const usePackageDetails = (packageId: string) => {
  const [pkg, setPkg] = useState<IPackageItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewStats, setReviewStats] = useState<IReviewStats | null>(null);
  const [reviews, setReviews] = useState<IReviewItem[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<IReviewItem | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.PACKAGE(packageId),
      );

      setPkg(data.pkg);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.REVIEWS(packageId),
      );

      setReviews(data.reviews);
      setReviewStats(data.stats);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.REVIEWS.ERROR, error);
    } finally {
      setLoading(false);
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
      const updatedData = { ...data, images: uploadedImageUrls };
      await axiosInstance.post(
        APP_ROUTES.USER.CREATE_REVIEW(packageId),
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
        APP_ROUTES.USER.UPDATE_REVIEW(reviewId, packageId),
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
        APP_ROUTES.USER.DELETE_REVIEW(reviewId, packageId),
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
    loading,
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
  };
};
