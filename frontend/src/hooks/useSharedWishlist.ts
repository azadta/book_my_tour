import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import type { IWishlistGroup } from "@/interfaces/IWishlistGroup";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useEffect, useState } from "react";

export const useSharedWishlist = ({ shareToken }: { shareToken: string }) => {
  const [wishlistGroup, setWishlistGroup] = useState<IWishlistGroup | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSharedWishlist = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get<{ result: IWishlistGroup }>(
        APP_ROUTES.WISHLISTS.PUBLIC.SHARED(shareToken),
      );

      setWishlistGroup(data.result);
    } catch (error) {
      const errorMessage = handleApiError(error);
      if (errorMessage) setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [shareToken]);
  useEffect(() => {
    if (shareToken) {
      fetchSharedWishlist();
    }
  }, [shareToken, fetchSharedWishlist]);

  return { error, loading, wishlistGroup };
};
