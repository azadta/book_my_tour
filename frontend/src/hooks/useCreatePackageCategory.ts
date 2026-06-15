import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import { useState } from "react";

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
      toast.success("Package category created successfully");
      return data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldError(error.response?.data?.errors);
        throw error
      }
      const message =
        error?.response?.data?.message || "Failed to create category";
      toast.error(message);
      throw error
    }
  };

  return { createPackageCategory,fieldError,setFieldError };
};
