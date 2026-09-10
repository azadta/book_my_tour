import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { RootState } from "@/redux/store";
import { MessageSquare } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatNotificationBadgeButton = () => {
  const { chats } = useSelector((state: RootState) => state.chat);
  const currentUser = useCurrentUser();
  const totalUnreadCount = useMemo(() => {
    if (!currentUser?.id || !chats) return 0;
    return chats.reduce((total, chat) => {
      const count = chat.unreadCount?.[currentUser.id] || 0;
      return total + count;
    }, 0);
  }, [chats, currentUser?.id]);
  if (totalUnreadCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce hover:animate-none">
      <Link
        to={FRONTEND_ROUTES.CHAT.USER_CHAT_PAGE}
        className="relative p-3.5 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white shadow-lg transition-all duration-200 flex items-center justify-center group"
        title="Unread Chat Messages"
      >
        <MessageSquare className="w-6 h-6 text-white group-hover:scale-[1.1] transition-transform" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-sky-400 text-white text-[11px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-md ">
            {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default ChatNotificationBadgeButton;
