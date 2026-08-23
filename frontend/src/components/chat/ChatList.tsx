import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { IChat } from "@/interfaces/IChat";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatListProps {
  chats: IChat[];
  activeChat: IChat | null;
  onSelectChat: (chat: IChat) => void;
  onlineUsers: string[];
}

const ChatList = ({
  activeChat,
  chats,
  onSelectChat,
  onlineUsers,
}: ChatListProps) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-sky-900 border-r border-sky-800/60 w-full">
      <div className="p-4 border-b border-sky-800/60 bg-sky-900/40 flex items-center justify-between ">
        <h2 className="text-xl font-semibold text-sky-50">Messages</h2>
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex items-center justify-center p-1.5 text-sky-300 hover:text-white hover:bg-sky-800/50 rounded-lg transition-colors hover:cursor-pointer"
          title="Close and go back"
          aria-label="Close messages"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-sky-900/60 ">
        {chats.map((chat) => {
          const recipient = chat.participants.find(
            (p) => p.participantId._id !== currentUser?.id,
          )?.participantId;
          const unreadCount = currentUser?.id
            ? chat.unreadCount?.[currentUser.id] || 0
            : 0;

          const isOnline = recipient
            ? onlineUsers.includes(recipient._id)
            : false;
          const isActive = activeChat?._id === chat._id;

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${isActive ? "bg-emerald-950/40 border-l-4 border-emerald-500" : "hover:bg-sky-900/40"}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <img
                    src={recipient?.image}
                    alt={recipient?.name}
                    className="w-11 h-11 rounded-full object-cover bg-sky-800 ring-1 ring-sky-700"
                  />
             
                </div>

                <div className="flex-1 min-w-0 ">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-medium text-sky-100 truncate">
                      {recipient?.name || "Unknown User"}
                    </h4>
                  </div>

                  <p className="text-xs text-sky-400 truncate">
                    {chat.lastMessage?.text || "No Messages yet"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {isOnline && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py--0.5 rounded-full border border-emerald-800/50 ">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                )}
              </div>
              {!isActive && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-bold text-sky-950 bg-emerald-400 rounded-full shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
