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
}

const ChatBox = ({
  activeChat,
  messages = [],
  onSendMessage,
  isTyping,
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
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50 ">
        <img
          src={recipient?.image}
          alt={recipient?.name}
          className="w-10 h-10 rounded-full object-cover bg-slate-700"
        />
        <div>
          <h3 className="text-md font-semibold text-white ">
            {recipient?.name}
          </h3>
          <p className="text-xs text-slate-400 capitalize ">
            {recipientParticipent?.participantModel}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-800 text-slate-100 rounded-bl-none"}`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-0.5 mt-1 px-1 text-[10px] text-slate-400">
                <span className="text-[10px] text-slate-500 mt-1 px-1">
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

        {isTyping && (
          <div className="text-xs text-slate-400 italic">
            Recipient is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-800 bg-slate-900/30 flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
