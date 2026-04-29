import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";

export interface CategoryPayload {
  name: string;
  description: string;
}

export const useCreatePackageCategory = () => {
  const createPackageCategory = async (payload: CategoryPayload) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/create-package-category`,
        payload,
      );
      toast.success("Package category created successfully");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create category";
      toast.error(message);
    }
  };

  return { createPackageCategory };
};
