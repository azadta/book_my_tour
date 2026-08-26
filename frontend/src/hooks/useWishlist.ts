import { axiosInstance } from "@/api/axiosInstance";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useWishlist = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<any | null>(null);
  const [noteText, setNoteText] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(APP_ROUTES.USER.WISHLISTS);
      const fetchedGroups = data.wishlistGroups || [];
      console.log('fetchedGroup from fetchWishlist',fetchedGroups)
      setGroups(fetchedGroups);
      if (activeGroup) {
        const updated = fetchedGroups.find(
          (g: any) => g._id === activeGroup._id,
        );
        if (updated) {
          setActiveGroup(updated);
        }
      } else if (fetchedGroups.length > 0) setActiveGroup(fetchedGroups[0]);
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.WISHLIST.ERROR.FETCH, error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGroup = async (groupId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      await axiosInstance.put(APP_ROUTES.USER.WISHLIST_UPDATE(groupId), {
        title: newTitle,
      });
      fetchWishlists();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.UPDATE_GROUP;
      console.error(message, error);
      toast.error(message);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axiosInstance.delete(APP_ROUTES.USER.WISHLIST_DELETE(groupId));
      setActiveGroup(null);
      fetchWishlists();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.DELETE_GROUP;
      console.error(message, error);
      toast.error(message);
    }
  };

  const handleAddNote = async () => {
    try {
      if (!noteText.trim() || !activeGroup) return;
      await axiosInstance.post(
        APP_ROUTES.USER.WISHLIST_ADD_NOTE(activeGroup._id),
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
        APP_ROUTES.USER.WISHLIST_UPDATE_NOTE(activeGroup._id, noteId),
        { text: newText },
      );

      fetchWishlists();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.UPDATE_NOTE;
      console.error(message, error);
      toast.error(message);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      if (!activeGroup) return;
      await axiosInstance.delete(
        APP_ROUTES.USER.WISHLIST_DELETE_NOTE(activeGroup._id, noteId),
      );

      fetchWishlists();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        FEEDBACK_MESSAGES.WISHLIST.ERROR.DELETE_NOTE;
      console.error(message, error);
      toast.error(message);
    }
  };

  const handleShare = async () => {
    try {
      if (!activeGroup) return;
      const { data } = await axiosInstance.get(
        APP_ROUTES.USER.WISHLIST_SHARE_LINK(activeGroup._id),
      );
      console.log('data from handleShare',data)
      const shareURL = `${window.location.origin}/shared-wishlist/${data.data.shareToken}`;
      navigator.clipboard.writeText(shareURL);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

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
