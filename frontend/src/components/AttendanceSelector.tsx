import { useAttendanceSelector } from "@/hooks/useAttendanceSelector";

interface AttendanceSelectorProps {
  bookingId: string;
  currentAttendance: string;
  onUpdate: () => void;
  onClose: () => void;
}

const AttendanceSelector: React.FC<AttendanceSelectorProps> = ({
  bookingId,
  currentAttendance = "PENDING",
  onUpdate,
  onClose,
}) => {
  const { handleStatusChange, loading, status } = useAttendanceSelector(
    currentAttendance,
    bookingId,
    () => {
      onUpdate();
      onClose();
    },
  );
  const getBadgeColor = (val: string) => {
    switch (val) {
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "NOT_SHOW":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h3 className="font-bold text-gray-800 text-lg mb-1">
          Mark Guest Attendance
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Select the current attendance status for this guest on the tour date.
        </p>
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            disabled={loading}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={` w-full text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer focus:outline-none transition ${getBadgeColor(status)}`}
          >
            <option value="PENDING">Pending Check-In</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="COMPLETED">Tour Completed</option>
            <option value="NOT_SHOW">No Show</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 border rounded text-xs font-sembold text-gray-600 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSelector;
