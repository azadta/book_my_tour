import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import type { BaseFormData } from "@/interfaces/interfaces";

export interface ICategoryForm extends BaseFormData {
  name: string;
  description: string;
}

export const useCreatePackageCategory = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const createPackageCategory = async (payload: ICategoryForm) => {
    try {
      const { data } = await axiosInstance.post(
        APP_ROUTES.PACKAGE_CATEGORIES.ADMIN.CREATE,
        payload,
      );
      toast.success(FEEDBACK_MESSAGES.PACKAGE_CATEGORY.SUCCESS.CREATE);
      return data.result;
    } catch (error) {
      handleApiError(error, { setFieldError });
    }
  };
  return { createPackageCategory, fieldError, setFieldError };
};
