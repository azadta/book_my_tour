import type { IPackage } from "@/redux/package/packageSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosInstance";
import type { Destination } from "@/interfaces/interfaces";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { APP_ROUTES } from "@/constants/AppRoutes";

export const useHome = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [destinationsByCategory, setDestinationsByCategory] = useState<
    Record<string, Destination[]>
  >({});

  const [packagesByCategory, setPackagesByCategory] = useState<
    Record<string, IPackage[]>
  >({});
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingPackagesByCategory, setLoadingPackagesByCategory] =
    useState(false);
  const [loadingDestinationsByCategory, setLoadingDestinationsByCategory] =
    useState(false);

  const fetchDestinationsByCategory = async (category: string) => {
    setLoadingDestinationsByCategory(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.DESTINATIONS_BY_PACKAGE_CATEGORY(category),
      );
      setDestinationsByCategory((prev) => ({ ...prev, [category]: data }));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.DESTINATON.ERROR.FETCH,
      );
    } finally {
      setLoadingDestinationsByCategory(false);
    }
  };

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const { data } = await axiosInstance.get(APP_ROUTES.USER.PACKAGES);

      setPackages(data.packages || []);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchPackagesByCategory = async (category: string) => {
    setLoadingPackagesByCategory(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.PACKAGES_BY_CATEGORY(category),
      );
      setPackagesByCategory((prev) => ({ ...prev, [category]: data }));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH,
      );
    } finally {
      setLoadingPackagesByCategory(false);
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
    loadingDestinationsByCategory,
    loadingPackagesByCategory,
    loadingPackages,
  };
};
