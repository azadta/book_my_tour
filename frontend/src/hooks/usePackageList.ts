import { useCallback, useEffect, useState } from "react";

import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type {
  ICategory,
  IPackageItem,
  IWishlistGroup,
} from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useSelector } from "react-redux";

export const usePackageList = () => {
  const [packages, setPackages] = useState<IPackageItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);
  const [totalPackagesCount, setTotalPackagesCount] = useState(0);
  const [activeCategories, setActiveCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [uniqueCategoryCount, setUniqueCategoryCount] = useState(0);
  const [wishlistGroups, setWishlistGroups] = useState<IWishlistGroup[]>([]);
  const [selectedPackageForWishList, setSelectedPackageForWishlist] = useState<
    string | null
  >(null);

  const { currentUser } = useSelector((state: RootState) => state.user);

  const fetchPackages = useCallback(async (query: string) => {
    setLoadingPackages(true);
    try {
      const { data } = await axiosInstance.get(
        `${APP_ROUTES.PACKAGES.USER.FILTER}?${query}`,
      );

      setPackages(data.result.packages || []);
      setTotalPackagesCount(data.result.totalCount || 0);
      setUniqueCategoryCount(data.result.uniqueCategoryCount || 0);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setLoadingPackages(false);
    }
  },[])

  const fetchActiveCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.PACKAGE_CATEGORIES.PUBLIC.ACTIVE,
      );

      setActiveCategories(data.result || []);
    } catch (error) {
      console.error(
        FEEDBACK_MESSAGES.PACKAGE_CATEGORY.ERROR.FETCH_ACTIVE,
        error,
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchWishlists = async () => {
    try {
      const { data } = await axiosInstance.get(APP_ROUTES.WISHLISTS.USER.LIST);

      setWishlistGroups(data.result);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleToggleWishlistGroup = async (groupId: string) => {
    if (!selectedPackageForWishList) return;
    try {
      await axiosInstance.post(APP_ROUTES.WISHLISTS.USER.TOGGLE, {
        groupId,
        packageId: selectedPackageForWishList,
      });
      await fetchWishlists();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateWishlistGroup = async (title: string) => {
    try {
      const { data } = await axiosInstance.post(
        APP_ROUTES.WISHLISTS.USER.CREATE_GROUP,
        { title },
      );

      if (data.success && selectedPackageForWishList) {
        await handleToggleWishlistGroup(data.result._id);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchActiveCategories();
  }, []);
  useEffect(() => {
    if (currentUser) fetchWishlists();
  }, [currentUser]);

  return {
    packages,
    loadingPackages,
    fetchPackages,
    totalPackagesCount,
    activeCategories,
    loadingCategories,
    uniqueCategoryCount,
    wishlistGroups,
    selectedPackageForWishList,
    setSelectedPackageForWishlist,
    handleCreateWishlistGroup,
    handleToggleWishlistGroup,
  };
};
