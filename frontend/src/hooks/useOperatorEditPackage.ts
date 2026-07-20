import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import type { ItineraryDay } from "@/components/itinerary/types";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useOperatorEditPackage = () => {
  const [loading, setLoading] = useState(false);
  const fetchPackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/operator/package/${id}`);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePackage = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      const imageFiles = (data.images ?? []).filter(
        (img: any) => img instanceof File,
      );
      const existingImages = (data.images ?? []).filter(
        (img: any) => typeof img === "string",
      );
      const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);

      const uploadedItinerary = await Promise.all(
        data.itinerary.map(async (day: ItineraryDay) => {
          const galleryFiles = day.gallery.filter(
            (img: any) => img instanceof File,
          );
          const existingUrls = day.gallery.filter(
            (img: any) => typeof img === "string",
          );

          const uploadedUrls = await uploadImagesToCloudinary(galleryFiles);
          return { ...day, gallery: [...existingUrls, ...uploadedUrls!] };
        }),
      );
      const payload = {
        ...data,
        images: [...existingImages, ...(uploadedImageUrls ?? [])],
        itinerary: uploadedItinerary,
      };

      await axiosInstance.put(APP_ROUTES.OPERATOR.PACKAGES_UPDATE(id), payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(APP_ROUTES.OPERATOR.DELETE_PACKAGE(id));
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    fetchPackage,
    updatePackage,

    deletePackage,
  };
};
