import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IPackageItem } from "@/interfaces/interfaces";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { unFlattenObject } from "../../../backend/utils/unFlattenObject";
import type { IReviewItem, IReviewStats } from "@/interfaces/IReview";
import { handleApiError } from "@/utils/axiosErrorHandler";

export const usePackageDetails = (packageId: string) => {
  const [pkg, setPkg] = useState<IPackageItem | null>(null);
  const [packageLoading, setPackageLoading] = useState<boolean>(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState<IReviewStats | null>(null);
  const [reviews, setReviews] = useState<IReviewItem[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<IReviewItem | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const fetchPackage = useCallback(async () => {
    setPackageLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGES.USER.DETAIL(packageId),
      );

      setPkg(data.result);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setPackageLoading(false);
    }
  }, [packageId]);

  const fetchReviews = useCallback(async () => {
    setReviewLoading(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGE_REVIEWS.PUBLIC.LIST_BY_PACKAGE_ID(packageId),
      );

      setReviews(data.result.reviews);
      setReviewStats(data.result.stats);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.REVIEWS.ERROR, error);
    } finally {
      setReviewLoading(false);
    }
  }, [packageId]);

  const openCreateModal = () => {
    setEditingReview(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (editPayload: IReviewItem) => {
    setEditingReview(editPayload);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(undefined);
  };

  const createReview = async (data: Record<string, unknown>) => {
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
      fetchReviews();
      toast.success(FEEDBACK_MESSAGES.REVIEWS.SUCCESS.CREATE);
      closeModal();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const updateReview = async (
    reviewId: string,
    data: Record<string, unknown>,
  ) => {
    const categoryRatingsData = (data.categoryRatings ?? {}) as Record<
      string,
      unknown
    >;
    const categoryRatings = {
      guide: categoryRatingsData?.guide ?? data["categoryRatings.guide"] ?? 5,
      value: categoryRatingsData?.value ?? data["categoryRatings.value"] ?? 5,
      itinerary:
        categoryRatingsData?.itinerary ??
        data["categoryRatings.itinerary"] ??
        5,
      transport:
        categoryRatingsData?.transport ??
        data["categoryRatings.transport"] ??
        5,
    };

    setSubmittingReview(true);
    try {
      const rawFiles = (data.images ?? []) as unknown[];

      const existingUrls = rawFiles.filter((img) => typeof img === "string");
      const newFiles = rawFiles.filter((img) => img instanceof File);
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
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const saveReview = async (payload: Record<string, unknown>) => {
    if (editingReview) {
      await updateReview(editingReview._id, payload);
    } else {
      await createReview(payload);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await axiosInstance.delete(
        APP_ROUTES.PACKAGE_REVIEWS.USER.DELETE(reviewId, packageId),
      );
      toast.success(FEEDBACK_MESSAGES.REVIEWS.SUCCESS.DELETE);
      fetchReviews();
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchPackage();
    fetchReviews();
  }, [fetchPackage, fetchReviews]);

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
    setIsBookingLoading,
  };
};
