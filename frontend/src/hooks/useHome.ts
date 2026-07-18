import type { IPackage } from "@/redux/package/packageSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import type { Destination } from "@/interfaces/interfaces";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";

export const useHome = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [destinationsByCategory, setDestinationsByCategory] = useState<
    Record<string, Destination[]>
  >({});

  const [packagesByCategory, setPackagesByCategory] = useState<
    Record<string, IPackage[]>
  >({});

  const fetchDestinationsByCategory = async (category: string) => {
    try {
      const { data } = await axiosInstance.get(
        `/user/destinations/package-category/${encodeURIComponent(category)}`,
      );
      setDestinationsByCategory((prev) => ({ ...prev, [category]: data }));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || FEEDBACK_MESSAGES.DESTINATON.ERROR.FETCH,
      );
    }
  };

  const fetchPackages = async () => {
    try {
      const { data } = await axiosInstance.get(`/user/packages`);

      setPackages(data.packages || []);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    }
  };

  const fetchPackagesByCategory = async (category: string) => {
    try {
      const { data } = await axiosInstance.get(
        `/user/packages/category/${encodeURIComponent(category)}`,
      );
      setPackagesByCategory((prev) => ({ ...prev, [category]: data }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    fetchDestinationsByCategory,
    fetchPackagesByCategory,
    packagesByCategory,
    destinationsByCategory,
    packages,
  };
};
