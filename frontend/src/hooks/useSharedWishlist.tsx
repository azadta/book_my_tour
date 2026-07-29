import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { useEffect, useState } from "react";

export const useSharedWishlist = ({ shareToken }: { shareToken: string }) => {
  const [wishlistGroup, setWishlistGroup] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSharedWishlist = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.WISHLIST_SHARED_GROUP(shareToken),
      );
    
      setWishlistGroup(data.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          FEEDBACK_MESSAGES.WISHLIST.ERROR.SHARED_GROUP,
      );
      console.error(FEEDBACK_MESSAGES.WISHLIST.ERROR.SHARED_GROUP, error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (shareToken) {
      fetchSharedWishlist();
    }
  }, [shareToken]);

  return { error, loading, wishlistGroup };
};
