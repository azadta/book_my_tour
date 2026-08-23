import { FRONTEND_ROUTES } from "@/constants/frontEndRoutes";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationBadgeButton = ({ unreadCount }: { unreadCount: number }) => {

  return (
    <Link
      to={FRONTEND_ROUTES.USER.NOTIFICATIONS}
      className="relative p-2.5 rounded-xl bg-orange-50/80 hover:bg-orange-50 text-slate-700 transition-all duration-200 flex items-center justify-center group"
      title="notifications"
    >
      <Bell className="w-5 h-5 text-orange-800 group-hover:text-orange-900 group-hover:scale-[1.1] transition-all" />
      {unreadCount>0&&(
        <span className="absolute -top-1 -right-1 bg-sky-400 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount>99?'99+':unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadgeButton;
