import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import axios from "axios";
import type { Option } from "../formConfig/fields";
import type { ItineraryDay } from "@/components/itinerary/types";

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

  const uploadImagesToCloudinary = async (files: File[]) => {
    const urls: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formData,
        );
        urls.push(res.data.secure_url);
      }
      return urls;
    } catch (error: any) {
      console.error(error);
    }
  };

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

      console.log('itinaray payload',payload.itinerary)

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
