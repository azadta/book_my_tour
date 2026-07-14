import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import type { ItineraryDay } from "@/components/itinerary/types";

export const useAdminEditPackage = () => {
  const [loading, setLoading] = useState(false);
  const fetchPackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/package/${id}`);
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
        images: [...existingImages,...(uploadedImageUrls??[])],
        itinerary: uploadedItinerary,
      };

      await axiosInstance.put(`/admin/packages/update/${id}`, payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/package/delete/${id}`);
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
