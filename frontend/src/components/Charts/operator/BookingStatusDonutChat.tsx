import type { BookingStatusItem } from "@/hooks/useOperatorDashboard";
import { useState } from "react";
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

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#C2410C" },
  CONFIRMED: { label: "Confirmed", color: "#F59E0B" },

  CANCEL_REQUESTED: {
    label: "Cancel Requested",
    color: "#C2410C",
  },
  FAILED: { label: "Failed", color: "#E11D48" },
  CANCELLED: { label: "Cancelled", color: "#4B5563" },
};

const DEFAULT_CONFIG = { label: "Other", color: "#9CA3AF" };

const CustomToolTip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const config = STATUS_CONFIG[data.name] || DEFAULT_CONFIG;
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-gray-100/80 flex items-center gap-3">
        <span
          className="w-3 h-3 rounded-full shadow-xs "
          style={{ backgroundColor: data.payload.fill }}
        />
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ">
            {config.label}
          </p>
          <p className="text-base font-bold text-gray-900">
            {data.value}
            <span className="text-xs font-normal text-gray-500"> Bookings</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};
const BookingStatusDonutChart = ({
  statusData = [],
}: BookingStatusDonutChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const formattedData = statusData.map((item) => ({
    name: item.status,
    value: item.count,
  }));
  const totalBookings = formattedData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );
  return (
    <div className="w-full  bg-white p-6 rounded-3xl shadow-xs border border-gray-100/80 flex flex-col transition-all duration-300 hover:shadow-md ">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Booking Status Breakdown
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Real-time distribution of tour reservations
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
          Total: {totalBookings}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
        <div className="md:col-span-7 h-[300px] relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none ">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Bookings
            </span>
            <span className="text-2xl font-black text-gray-900">
              {totalBookings}
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={6}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                dataKey="value"
                stroke="none"
              >
                {formattedData.map((entry, index) => {
                  const config = STATUS_CONFIG[entry.name] || DEFAULT_CONFIG;
                  const isHovered = activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={config.color}
                      className="transition-all duration-300 cursor-pointer outline-none"
                      style={{
                        filter: isHovered
                          ? "brightness(1.08) drop-shadow(0px 6px 16px rgba(0,0,0,0.12))"
                          : "none",
                        transform: isHovered ? "scale(1.03)" : "scale(1)",
                        transformOrigin: "center center",
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomToolTip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-5 flex flex-col gap-2.5 px-2">
          {formattedData.map((entry) => {
            const config = STATUS_CONFIG[entry.name] || DEFAULT_CONFIG;
            const percentage =
              totalBookings > 0
                ? ((entry.value / totalBookings) * 100).toFixed(1)
                : "0";
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between p-2 rounded-xl bg-gray-50/80 border border-gray-100 transition-all hover:bg-gray-100/60"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs "
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    {entry.value}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded-md border border-gray-100">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStatusDonutChart;
