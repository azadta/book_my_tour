import { APP_ROUTES } from "@/constants/AppRoutes";
import type { ICategory } from "@/interfaces/interfaces";
import type {
  FormItineraryDay,
  FormPackage,
  IDestination,
} from "@/interfaces/IPackage";

import { handleApiError } from "@/utils/axiosErrorHandler";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import { useEffect, useState } from "react";
import type {
  IActivityDTO,
  IOptionalActivityDTO,
  PackageInput,
} from "../../../backend/dto-mapping/dto/package/packageRequestDTO";
import { axiosInstance } from "../api/axiosInstance";
import type { Option } from "../formConfig/fields";

export const useCreatePackage = () => {
  const [categories, setCategories] = useState<Option[]>([]);
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchDropDownOptions = async () => {
    try {
      const [catRes, destRes] = await Promise.all([
        await axiosInstance.get(APP_ROUTES.PACKAGE_CATEGORIES.PUBLIC.ALL),
        await axiosInstance.get(APP_ROUTES.PACKAGE_DESTINATIONS.PUBLIC.ALL),
      ]);
      setCategories(
        catRes.data.result.map((cat: ICategory) => ({
          label: cat.name,
          value: cat._id,
        })),
      );

      setDestinations(
        destRes.data.result.map((dest: IDestination) => ({
          label: dest.name,
          value: dest._id,
        })),
      );
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchDropDownOptions();
  }, []);

  const createPackage = async (data: FormPackage) => {
    setLoading(true);
    try {
      const rawImages = data.images ?? [];
      const imageFiles = rawImages.filter(
        (img): img is File => img instanceof File,
      );
      const existingImageUrls = rawImages.filter(
        (img): img is string => typeof img === "string",
      );
      const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
      const finalPackageImages = [
        ...existingImageUrls,
        ...(uploadedImageUrls ?? []),
      ];
      const uploadedItinerary = await Promise.all(
        data.itinerary.map(async (day: FormItineraryDay) => {
          const galleryFiles = day.gallery.filter(
            (img): img is File => img instanceof File,
          );
          const existingGalleryUrls = day.gallery.filter(
            (img) => typeof img === "string",
          );

          const uploadedGalleryUrls =
            await uploadImagesToCloudinary(galleryFiles);

          const processedActivities: IActivityDTO[] = await Promise.all(
            (day.activities ?? []).map(async (activity) => {
              if (activity.image instanceof File) {
                const uploaded = await uploadImagesToCloudinary([
                  activity.image,
                ]);
                return { ...activity, image: uploaded?.[0] || "" };
              }
              return { ...activity, image: activity.image };
            }),
          );

          const processedOptionals: IOptionalActivityDTO[] = await Promise.all(
            (day.optionalActivities ?? []).map(async (opt) => {
              if (opt.image instanceof File) {
                const uploaded = await uploadImagesToCloudinary([opt.image]);
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
        images: finalPackageImages,
        itinerary: uploadedItinerary,
      };

      await axiosInstance.post(APP_ROUTES.PACKAGES.OPERATOR.CREATE, payload);
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
