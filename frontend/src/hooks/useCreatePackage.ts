import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import axios from "axios";
import type { Option } from "../formConfig/fields";
import type { ItineraryDay } from "@/components/itinerary/types";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";

export const useCreatePackage = () => {
  const [categories, setCategories] = useState<Option[]>([]);
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchDropDownOptions = async () => {
    try {
      const [catRes, destRes] = await Promise.all([
        await axiosInstance.get(`/operator/package-categories`),
        await axiosInstance.get(`/operator/destinations`),
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
      console.error(`Error fetching dropdown data`, error.message);
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

      await axiosInstance.post("/operator/create-package", payload);
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
