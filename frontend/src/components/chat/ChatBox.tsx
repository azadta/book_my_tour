import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { IChat, IMessage } from "@/interfaces/IChat";
import { getSocket } from "@/socket/socket";
import { useEffect, useRef, useState } from "react";
import MessageStatusIcon from "./MessageStatusIcon";

interface ChatBoxProps {
  activeChat: IChat | null;
  messages: IMessage[];
  onSendMessage: (
    text: string,
    recipientId: string,
    recipientIdModel: "User" | "Operator" | "Admin",
  ) => void;
  isTyping: boolean;
  onClearChat: (chatId: string) => void;
}

const ChatBox = ({
  activeChat,
  messages = [],
  onSendMessage,
  isTyping,
  onClearChat,
}: ChatBoxProps) => {
  const [text, setText] = useState("");
  const currentUser = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recipientParticipent = activeChat?.participants.find(
    (p) => p.participantId?._id !== currentUser?.id,
  );
  const recipient = recipientParticipent?.participantId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (!activeChat || !recipient) return;
    const socket = getSocket();
    socket.emit("typing", {
      chatId: activeChat._id,
      recipientId: recipient._id,
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        chatId: activeChat._id,
        recipientId: recipient._id,
      });
    }, 2000);
  };

  const handleSend = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!text.trim() || !recipient || !recipientParticipent) return;
    onSendMessage(text, recipient._id, recipientParticipent.participantModel);
    setText("");
    if (activeChat) {
      getSocket().emit("stop_typing", {
        chatId: activeChat._id,
        recipientId: recipient._id,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-sky-950">
      <div className="flex items-center justify-between p-4 border-b border-sky-800/60 bg-sky-900/40">
        <div className="flex gap-5 items-center justify-center">
        <div className="  flex items-center gap-3  ">
          <img
            src={recipient?.image}
            alt={recipient?.name}
            className="w-10 h-10 rounded-full object-cover bg-sky-800 ring-1 ring-sky-700"
          />
          <div>
            <h3 className="text-md font-semibold text-sky-50 ">
              {recipient?.name}
            </h3>
            <p className="text-xs text-emerald-400 font-medium capitalize ">
              {recipientParticipent?.participantModel}
            </p>
          </div>
        </div>
        {isTyping && (
          <div className="text-xs text-emerald-100 italic font-medium">
            typing...
          </div>
        )}
        </div>
        <button
          onClick={() => onClearChat(activeChat?._id as string)}
          className="px-3 py-1.5 text-xs text-sky-200 hover:text-red-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer border border-sky-800 hover:border-rose-900"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sky-950/80">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950/20" : "bg-sky-900/90 text-sky-100 border border-sky-800/50 rounded-bl-none"}`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-0.5 mt-1 px-1 text-[10px] text-sky-400">
                <span className="text-[10px] text-sky-400/80 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isMe && <MessageStatusIcon status={msg.status} />}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-sky-800/60 bg-sky-900/50 flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 bg-sky-900/50 border border-sky-800 text-sky-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-200 transition-all"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-md shadow-emerald-950/30"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
