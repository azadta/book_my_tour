import ChatBox from "@/components/chat/ChatBox";
import ChatList from "@/components/chat/ChatList";
import { useChat } from "@/hooks/useChats";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ChatPage = () => {
  const {
    activeChat,
    chats,
    fetchChats,
    messages,
    onlineUsers,
    selectChat,
    accessChat,
    sendMessage,
    typingUsers,
    clearChat,
  } = useChat();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!userIdParam) return;
    const targetChat = chats.find((c) =>
      c.participants.some((p) => p.participantId._id === userIdParam),
    );
    if (targetChat) {
      selectChat(targetChat);
    } else {
      accessChat(userIdParam, "Operator");
    }
  }, [userIdParam, chats, accessChat]);

  const handleBackToList = () => {
    selectChat(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-sky-950 overflow-hidden  mt-5  border-t border-sky-800/40">
      <div className="flex items-center px-4 py-2 border-b border-sky-800/60 bg-sky-900/60 md:hidden">
        {activeChat ? (
          <button
            onClick={handleBackToList}
            className="flex items-center text-sky-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Chats</span>
          </button>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sky-200 hover:text-white transition-colors "
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-full md:w-80  shrink-0 ${activeChat ? "hidden md:block" : "block"}`}
        >
          <ChatList
            chats={chats}
            activeChat={activeChat}
            onSelectChat={selectChat}
            onlineUsers={onlineUsers}
          />
        </div>
        <div
          className={`flex-1 ${activeChat ? "block" : "hidden md:flex md:items-center md:justify-center bg-sky-950/60"}`}
        >
          {chats.length === 0 && (
            <div className="hidden md:flex flex-col items-center justify-center text-sky-400/80">
              <p>No messages Found</p>
            </div>
          )}
          {activeChat && (
            <ChatBox
              activeChat={activeChat}
              messages={messages}
              onSendMessage={sendMessage}
              isTyping={activeChat ? !!typingUsers[activeChat._id] : false}
              onClearChat={clearChat}
            />
          )}
          {chats.length > 0 && !activeChat && (
            <div className="hidden md:flex flex-col items-center justify-center text-sky-400/80">
              <p>Select a chat for conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
