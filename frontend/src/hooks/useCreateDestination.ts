import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import type { BaseFormData } from "@/interfaces/interfaces";
import { uploadImagesToS3 } from "../utils/uploadImagesToS3";

export interface CreateDestinationFormData extends BaseFormData {
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

  const createDestination = async (formData: CreateDestinationFormData) => {
    setLoading(true);
    try {
      const latitude = Number(formData.latitude);
      const longitude = Number(formData.longitude);
      let uploadedImages: string[] = [];
      if (formData.images && formData.images.length > 0) {
        const files = Array.from(formData.images);
        uploadedImages = await uploadImagesToS3(files, "destinations");
      }
      const payload: DestinationPayload = {
        name: formData.name.trim(),
        latitude,
        longitude,
        images: uploadedImages,
      };

      await axiosInstance.post(
        APP_ROUTES.PACKAGE_DESTINATIONS.ADMIN.CREATE,
        payload,
      );
      toast.success(FEEDBACK_MESSAGES.DESTINATON.SUCCESS.CREATE);
      onSuccess?.();
    } catch (error: unknown) {
      handleApiError(error, { setFieldError });
    } finally {
      setLoading(false);
    }
  };

  return { createDestination, loading, fieldError, setFieldError };
};
