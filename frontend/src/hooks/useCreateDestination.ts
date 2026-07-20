import axios from "axios";
import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export interface CreateDestinationFormData {
  name: string;
  latitude: string | number;
  longitude: string | number;
  images?: FileList | File[];
}

export interface DestinationPayload {
  name: string;
  latitude: number;
  longitude: number;
  images: string[];
}

export const useCreateDestination = (onSuccess?: () => void) => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const { data } = await axios.post(
      APP_ROUTES.EXTERNAL.CLOUDINARY(cloudName),
      formData,
    );

    return data.secure_url;
  };

  const createDestination = async (formData: CreateDestinationFormData) => {
    setLoading(true);
    try {
      const latitude = Number(formData.latitude);
      const longitude = Number(formData.longitude);
      let uploadedImages: string[] = [];
      if (formData.images && formData.images.length > 0) {
        const files = Array.from(formData.images);
        uploadedImages = await Promise.all(files.map(uploadToCloudinary));
      }
      const payload: DestinationPayload = {
        name: formData.name.trim(),
        latitude,
        longitude,
        images: uploadedImages,
      };

      await axiosInstance.post( APP_ROUTES.ADMIN.CREATE_DESTINATION, payload);
      toast.success(FEEDBACK_MESSAGES.DESTINATON.SUCCESS.CREATE);
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        throw error;
      }
      const message =
        error?.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        FEEDBACK_MESSAGES.DESTINATON.ERROR.CREATE;
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createDestination, loading, fieldError, setFieldError };
};
