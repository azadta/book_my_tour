import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { useState } from "react";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

export interface CategoryPayload {
  name: string;
  description: string;
}

export const useCreatePackageCategory = () => {
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const createPackageCategory = async (payload: CategoryPayload) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/create-package-category`,
        payload,
      );
      toast.success(FEEDBACK_MESSAGES.PACKAGE_CATEGORY.SUCCESS.CREATE);
      return data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        throw error
      }
      const message =
        error?.response?.data?.message ||FEEDBACK_MESSAGES.PACKAGE_CATEGORY.ERROR.CREATE;
      toast.error(message);
      throw error
    }
  };

  return { createPackageCategory,fieldError,setFieldError };
};
