import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

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
        const res = await axiosInstance.get(`/user/package-categories`);
        setCategories(res.data);
      } catch (error: any) {
        setError(error.response?.data?.message || FEEDBACK_MESSAGES.PACKAGE_CATEGORY.ERROR.FETCH);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};
