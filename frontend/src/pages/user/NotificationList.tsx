import { useNotifications } from "@/hooks/useNotifications";
import type { RootState } from "@/redux/store";
import { Bell, CheckCheck, CheckCircle2, Clock, Inbox, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const NotificationList = () => {
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification,
  );
  const {
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  if (loading) return <div>Loading notifications...</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row  sm:items-center justify-between gap-4  mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updates regarding your bookings and trip itineraries
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-sky-700"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 ">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              All caught up!
            </p>
            <p className="text-xs  text-slate-400 mt-1">
              You have no new notifications at the moment.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`group relative p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${!item.isRead ? "bg-linear-r from-sky-50/80 to-indigo-50/30 border-sky-200/80 shadow-sm" : "bg-white border-slate-100 hover:border-slate-200"}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${!item.isRead ? "bg-sky-600 text-white shadow-md shadow-sky-500/20" : "bg-slate-100 text-slate-500"}`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm  text-slate-800">{item.title}</h3>
                    {!item.isRead && (
                      <span className="inline-block w-2 h-2 rounded-full bg-sky-500 "></span>
                    )}
                  </div>

                  <p className="text-md font-semibold text-slate-600 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 ">
                    <Clock className="w-4 h-3" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                {!item.isRead ? (
                  <button
                    onClick={() => handleMarkAsRead(item._id)}
                    className="px-3.5 py-1.5 bg-white hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-2 py-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Read</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
