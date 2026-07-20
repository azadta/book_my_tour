import type { ItineraryDay } from "@/components/itinerary/types";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import type { Option } from "../formConfig/fields";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useCreatePackage = () => {
  const [categories, setCategories] = useState<Option[]>([]);
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchDropDownOptions = async () => {
    try {
      const [catRes, destRes] = await Promise.all([
        await axiosInstance.get(APP_ROUTES.OPERATOR.PACKAGE_CATEGORIES),
        await axiosInstance.get(APP_ROUTES.OPERATOR.DESTINATIONS),
      ]);
      setCategories(
        catRes.data.map((cat: any) => ({
          label: cat.name,
          value: cat._id,
        })),
      );

      setDestinations(
        destRes.data.map((dest: any) => ({
          label: dest.name,
          value: dest._id,
        })),
      );
    } catch (error: any) {
      console.error(
        FEEDBACK_MESSAGES.GLOBAL.ERROR.DROP_DOWN_FETCH_FAILED,
        error.message,
      );
    }
  };

  useEffect(() => {
    fetchDropDownOptions();
  }, []);

  const createPackage = async (data: any) => {
    setLoading(true);
    try {
      const imageFiles = data.images ?? [];
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
        images: uploadedImageUrls,
        itinerary: uploadedItinerary,
      };

      await axiosInstance.post(APP_ROUTES.OPERATOR.CREATE_PACKAGE, payload);
    } finally {
      setLoading(false);
    }
  };

  return {
    createPackage,

    categories,
    destinations,
    loading,
  };
};
