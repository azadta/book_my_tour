import { useEffect, useState } from "react";

import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type {
  ICategory,
  IPackageItem,
  IWishlistGroup,
} from "@/interfaces/interfaces";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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

  const fetchPackages = async (query: string) => {
    setLoadingPackages(true);
    try {
      const { data } = await axiosInstance.get(
        `${APP_ROUTES.USER.PACKAGE_FILTER}?${query}`,
      );

      setPackages(data.packages || []);
      setTotalPackagesCount(data.totalCount || 0);
      setUniqueCategoryCount(data.uniqueCategoryCount || 0);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.PACKAGE.ERROR.FETCH, error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchActiveCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.ACTIVE_PACKAGE_CATEGORIES,
      );

      setActiveCategories(data.categories || []);
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
      const { data } = await axiosInstance.get(APP_ROUTES.USER.WISHLISTS);

      setWishlistGroups(data.wishlistGroups);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.FETCH;
      toast.error(message);

      console.error(message, error);
    }
  };

  const handleToggleWishlistGroup = async (groupId: string) => {
    if (!selectedPackageForWishList) return;
    try {
      await axiosInstance.post(APP_ROUTES.USER.WISHLIST_TOGGLE, {
        groupId,
        packageId: selectedPackageForWishList,
      });
      await fetchWishlists();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.TOGGLE;
      toast.error(message);
      console.error(message, error);
    }
  };

  const handleCreateWishlistGroup = async (title: string) => {
    try {
      const { data } = await axiosInstance.post(
        APP_ROUTES.USER.WISHLIST_CREATE,
        { title },
      );

      if (data.success && selectedPackageForWishList) {
        await handleToggleWishlistGroup(data.wishlistGroup._id);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.CREATE_GROUP;
      toast.error(message);
      console.error(message, error);
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
