import { APP_ROUTES } from "@/constants/AppRoutes";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export interface Category {
  _id: string;
  name: string;
}

export const usePackageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          APP_ROUTES.PACKAGE_CATEGORIES.PUBLIC.ALL,
        );
        setCategories(res.data.result);
      } catch (error) {
        const errorMessage = handleApiError(error);
        if (errorMessage) setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};
