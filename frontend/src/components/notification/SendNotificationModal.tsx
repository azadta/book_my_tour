import { Bell, Send, User, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ISendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooking: any;
  onSend: (title: string, message: string) => Promise<boolean>;
}

const SendNotificationModal = ({
  isOpen,
  onClose,
  onSend,
  selectedBooking,
}: ISendNotificationModalProps) => {
  const [title, setTitle] = useState(
    selectedBooking
      ? `Update: Booking#${selectedBooking._id?.slice(-6).toUpperCase()}`
      : "",
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBooking) {
      setTitle(
        `Update: Booking#${selectedBooking._id?.slice(-6).toUpperCase()}`,
      );
    }
  }, [selectedBooking]);

  if (!isOpen) return null;
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const success = await onSend(title, message);
    setLoading(false);
    if (success) {
      setMessage("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg  overflow-hidden transition-all transform scale-100">
        <div className="bg-linear-to-r from-sky-600 via-sky-500 to-indigo-600 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Bell className="w-5 h-5 text-white" />
            </div>

            <div>
              <h3 className="text-base font-semibold tracking-wide">
                Send Guest Update
              </h3>
              <p className="text-xs text-sky-100/80">
                Direct Notification regarding booking details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-600">
            <User className="w-4 h-4 text-sky-600" />
            <span>Recipient:</span>
            <span className="font-semibold text-slate-800">
              {selectedBooking?.userId?.name || "Guest"}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ">
              Subject Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all  "
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notification Message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none "
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Sending..." : "Send Notification"}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationModal;
