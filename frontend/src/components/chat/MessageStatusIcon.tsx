interface MessageStatusIconProps {
  status: "SENT" | "DELIVERED" | "READ";
}

const MessageStatusIcon = ({ status }: MessageStatusIconProps) => {
  if (status === "SENT") {
    return (
      <svg
        className="w-3.5 h-3.5 text-slate-400 inline-block ml-1 "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  const isRead = status === "READ";
  const colorClass = isRead ? "text-sky-400" : "text-slate-400";
  return (
    <div className={`inline-flex items-center -space-x-1.5 ml-1 ${colorClass}`}>
      <svg
        className="w-3.5 h-3.5  "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <svg
        className="w-3.5 h-3.5 "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
};

export default MessageStatusIcon;
