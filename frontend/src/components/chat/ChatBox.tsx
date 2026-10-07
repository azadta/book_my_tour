import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { IChat, IMessage } from "@/interfaces/IChat";
import { getSocket } from "@/socket/socket";
import { uploadImagesToCloudinary } from "@/utils/uploadImagesToCloudinary";
import { Image } from "lucide-react";
import { useRef, useState } from "react";
import MessageStatusIcon from "./MessageStatusIcon";

interface ChatBoxProps {
  activeChat: IChat | null;
  messages: IMessage[];
  onSendMessage: (
    text: string,
    recipientId: string,
    recipientIdModel: "User" | "Operator" | "Admin",
    image?: string,
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setIMagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUser = useCurrentUser();

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recipientParticipent = activeChat?.participants.find(
    (p) => p.participantId?._id !== currentUser?.id,
  );
  const recipient = recipientParticipent?.participantId;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIMagePreview(URL.createObjectURL(file));
    }
  };

  const handleSend = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if ((!text.trim() && !imageFile) || !recipient || !recipientParticipent)
      return;
    try {
      setIsUploading(true);
      let imageUrl = "";
      if (imageFile) {
        const urls = await uploadImagesToCloudinary([imageFile]);
        if (urls && urls.length > 0) {
          imageUrl = urls[0];
        }
      }
      onSendMessage(
        text,
        recipient._id,
        recipientParticipent.participantModel,
        imageUrl,
      );
      setText("");
      setImageFile(null);
      setIMagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (activeChat) {
        getSocket().emit("stop_typing", {
          chatId: activeChat._id,
          recipientId: recipient._id,
        });
      }
    } catch (error) {
      console.error(FEEDBACK_MESSAGES.CHATS.ERROR.IMAGE_MESSAGE, error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full ">
      <div className="flex items-center justify-between p-4 border-b border-sky-800/60 bg-sky-700/90">
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
          className="px-3 py-1.5 text-xs text-sky-100 hover:text-sky-300 hover:bg-sky-950/40 rounded-lg transition-colors cursor-pointer border border-sky-200 hover:border-white"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/900">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md px-2 py-2  rounded-2xl text-sm ${isMe ? "bg-emerald-200 text-gray-900 rounded-br-none shadow-md shadow-emerald-950/20" : "bg-emerald-300 text-white border border-emerald-800 rounded-bl-none"}`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Attachement"
                    className="w-full max-h-40 object-cover cursor-pointer  hover:opacity-95"
                    onClick={() => window.open(msg.image, "_blank")}
                  />
                )}
                {msg.text && <div className="px-1 py-1 ">{msg.text}</div>}
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
      </div>
      {imagePreview && (
        <div className="px-4 py-2 bg-sky-900/90 flex items-center gap-2 border-t border-sky-800/60">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-sky-400">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setIMagePreview(null);
              }}
              className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
            >
              X
            </button>
          </div>
          <span className="text-xs text-sky-200">
            Image attached ready to send
          </span>
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-sky-800/60 bg-sky-900/90 flex gap-2"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sky-200 hover:text-white py-2.5 p-2.5 bg-sky-200/50 border border-sky-400/50 rounded-xl transition-colors cursor-point"
          title="Attach Image"
        >
          <Image />
        </button>
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder={isUploading ? "Uploading image" : "Type a message"}
          disabled={isUploading}
          className="flex-1 bg-sky-900/50 border border-sky-400 text-sky-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-200 transition-all"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-md shadow-emerald-950/30"
        >
          {isUploading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
