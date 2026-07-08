import { useEffect, useState } from "react";

import { axiosInstance } from "@/api/axiosInstance";
import type { ICategory, IPackageItem } from "@/interfaces/interfaces";

export const usePackageList = () => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);
  const [totalPackagesCount, setTotalPackagesCount] = useState(0);
  const [activeCategories, setActiveCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [uniqueCategoryCount, setUniqueCategoryCount] = useState(0);

  const fetchPackages = async (query: string) => {
    setLoadingPackages(true);
    try {
      const { data } = await axiosInstance.get(
        `/user/packages/filter?${query}`,
      );

      setPackages(data.packages || []);
      setTotalPackagesCount(data.totalCount || 0);
      setUniqueCategoryCount(data.uniqueCategoryCount || 0);
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchActiveCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data } = await axiosInstance.get(
        `/user/active-package-categories`,
      );

      setActiveCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch active categories", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchActiveCategories();
  }, []);

  return {
    packages,
    loadingPackages,
    fetchPackages,
    totalPackagesCount,
    activeCategories,
    loadingCategories,
    uniqueCategoryCount,
  };
};
