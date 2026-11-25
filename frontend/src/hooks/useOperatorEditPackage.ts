import type { ItineraryDay } from "@/components/itinerary/types";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

import type { FormPackage } from "@/interfaces/IPackage";
import { uploadImagesToS3 } from "@/utils/uploadImagesToS3";
import type {
  IActivityDTO,
  IOptionalActivityDTO,
  PackageInput,
} from "../../../backend/dto-mapping/dto/package/packageRequestDTO";

export const useOperatorEditPackage = () => {
  const [loading, setLoading] = useState(false);
  const fetchPackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        APP_ROUTES.PACKAGES.OPERATOR.DETAIL(id),
      );
      return res.data.result;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePackage = useCallback(async (id: string, data: FormPackage) => {
    setLoading(true);
    try {
      const imageFiles = (data.images ?? []).filter(
        (img) => img instanceof File,
      );
      const existingImages = (data.images ?? []).filter(
        (img) => typeof img === "string",
      );
      const uploadedImageUrls = await uploadImagesToS3(imageFiles, "packages");

      const uploadedItinerary = await Promise.all(
        data.itinerary.map(async (day: ItineraryDay) => {
          const galleryFiles = day.gallery.filter((img) => img instanceof File);
          const existingGalleryUrls = day.gallery.filter(
            (img) => typeof img === "string",
          );

          const uploadedGalleryUrls = await uploadImagesToS3(
            galleryFiles,
            "packages",
          );

          const processedActivities: IActivityDTO[] = await Promise.all(
            (day.activities ?? []).map(async (activity) => {
              if (activity.image instanceof File) {
                const uploaded = await uploadImagesToS3(
                  [activity.image],
                  "packages",
                );
                return { ...activity, image: uploaded?.[0] || "" };
              }
              return { ...activity, image: activity.image };
            }),
          );

          const processedOptionals: IOptionalActivityDTO[] = await Promise.all(
            (day.optionalActivities ?? []).map(async (opt) => {
              if (opt.image instanceof File) {
                const uploaded = await uploadImagesToS3(
                  [opt.image],
                  "packages",
                );
                return { ...opt, image: uploaded?.[0] || "" };
              }
              return { ...opt, image: opt.image };
            }),
          );

          return {
            ...day,
            gallery: [...existingGalleryUrls, ...(uploadedGalleryUrls ?? [])],
            activities: processedActivities,
            optionalActivities: processedOptionals,
          };
        }),
      );
      const payload: PackageInput = {
        ...data,
        images: [...existingImages, ...(uploadedImageUrls ?? [])],
        itinerary: uploadedItinerary,
      };

      await axiosInstance.put(APP_ROUTES.PACKAGES.OPERATOR.UPDATE(id), payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePackage = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(APP_ROUTES.PACKAGES.OPERATOR.DELETE(id));
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
