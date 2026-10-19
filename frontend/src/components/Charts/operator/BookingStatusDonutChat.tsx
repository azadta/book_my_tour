import type { BookingStatusItem } from "@/hooks/useOperatorDashboard";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface BookingStatusDonutChartProps {
  statusData?: BookingStatusItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#10b981",
  CANCEL_REQUESTED: "#8b5cf6",
  FAILED: "#f43f5e",
  CANCELLED: "#ef4444",
};

const DEFAULT_COLOR = "#6b7280";

const BookingStatusDonutChat = ({
  statusData = [],
}: BookingStatusDonutChartProps) => {

  const formattedData = statusData.map((item) => ({
    name: item.status,
    value: item.count,
  }));
  return (
    <div className="w-full h-[400px] bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col ">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Booking Status Breakdown
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
              label={({ name, value }) => `${name}:${value}`}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name] || DEFAULT_COLOR}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, `Bookings(${name})`]}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingStatusDonutChat;
