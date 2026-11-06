import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import type { IWishlistGroup } from "@/interfaces/IWishlistGroup";
import { handleApiError } from "@/utils/axiosErrorHandler";
import { useCallback, useEffect, useState } from "react";

export const useWishlist = () => {
  const [groups, setGroups] = useState<IWishlistGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<IWishlistGroup | null>(null);
  const [noteText, setNoteText] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWishlists = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<{ result: IWishlistGroup[] }>(
        APP_ROUTES.WISHLISTS.USER.LIST,
      );

      const fetchedGroups = data.result || [];

      setGroups(fetchedGroups);
      setActiveGroup((prev) => {
        if (prev) {
          const updated = fetchedGroups.find((g) => g._id === prev._id);
          if (updated) return updated;
        }
        return fetchedGroups[0] ?? null;
      });
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.WISHLIST.ERROR.FETCH, error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditGroup = async (groupId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      await axiosInstance.put(APP_ROUTES.WISHLISTS.USER.UPDATE_GROUP(groupId), {
        title: newTitle,
      });
      fetchWishlists();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axiosInstance.delete(
        APP_ROUTES.WISHLISTS.USER.DELETE_GROUP(groupId),
      );
      setActiveGroup(null);
      fetchWishlists();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddNote = async () => {
    try {
      if (!noteText.trim() || !activeGroup) return;
      await axiosInstance.post(
        APP_ROUTES.WISHLISTS.USER.ADD_NOTE(activeGroup._id),
        { text: noteText },
      );
      setNoteText("");
      fetchWishlists();
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.WISHLIST.ERROR.ADD_NOTE, error);
    }
  };

  const handleEditNote = async (noteId: string, newText: string) => {
    try {
      if (!activeGroup || !newText.trim()) return;
      await axiosInstance.put(
        APP_ROUTES.WISHLISTS.USER.UPDATE_NOTE(activeGroup._id, noteId),
        { text: newText },
      );

      fetchWishlists();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      if (!activeGroup) return;
      await axiosInstance.delete(
        APP_ROUTES.WISHLISTS.USER.DELETE_NOTE(activeGroup._id, noteId),
      );

      fetchWishlists();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleShare = async () => {
    try {
      if (!activeGroup) return;
      const { data } = await axiosInstance.get(
        APP_ROUTES.WISHLISTS.USER.SHARE_LINK(activeGroup._id),
      );

      const shareURL = `${window.location.origin}/shared-wishlist/${data.result.shareToken}`;
      navigator.clipboard.writeText(shareURL);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  return {
    setActiveGroup,
    activeGroup,
    handleShare,
    copiedToken,
    noteText,
    setNoteText,
    handleAddNote,
    groups,
    setGroups,
    loading,
    handleEditGroup,
    handleDeleteGroup,
    handleEditNote,
    handleDeleteNote,
  };
};
