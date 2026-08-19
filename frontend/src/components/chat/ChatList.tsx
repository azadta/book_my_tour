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
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-80">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between ">
        <h2 className="text-xl font-semibold text-white">Messages</h2>
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex items-center justify-center p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hover:cursor-pointer"
          title="Close and go back"
          aria-label="Close messages"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 ">
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
              className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${isActive ? "bg-indigo-600/20 border-l-4 border-indigo-500" : "hover:bg-slate-800/50"}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <img
                    src={recipient?.image}
                    alt={recipient?.name}
                    className="w-11 h-11 rounded-full object-cover bg-slate-700"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0 ">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-medium text-slate-100 truncate">
                      {recipient?.name || "Unknown User"}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-400 truncate">
                    {chat.lastMessage?.text || "No Messages yet"}
                  </p>
                </div>
              </div>
              {!isActive && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-bold text-white bg-indigo-600 rounded-full">
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
