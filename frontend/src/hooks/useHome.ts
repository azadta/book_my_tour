import { APP_ROUTES } from "@/constants/AppRoutes";
import type { Destination } from "@/interfaces/interfaces";

import type { IPackage } from "@/interfaces/IPackage";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

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

  const fetchDestinationsByCategory = useCallback(async (category: string) => {
    setLoadingDestinationsByCategory(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGE_DESTINATIONS.PUBLIC.BY_PACKAGE_CATEGORY(category),
      );
      console.log("data from fetchDestination:", data);
      setDestinationsByCategory((prev) => ({
        ...prev,
        [category]: data.result,
      }));
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingDestinationsByCategory(false);
    }
  }, []);

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);
    try {
      const { data } = await axiosInstance.get(APP_ROUTES.PACKAGES.USER.LIST);

      setPackages(data.result || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingPackages(false);
    }
  }, []);
  const fetchPackagesByCategory = useCallback(async (category: string) => {
    setLoadingPackagesByCategory(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGES.USER.BY_CATEGORY(category),
      );
      setPackagesByCategory((prev) => ({ ...prev, [category]: data.result }));
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingPackagesByCategory(false);
    }
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
    fetchPackages,
  };
};
