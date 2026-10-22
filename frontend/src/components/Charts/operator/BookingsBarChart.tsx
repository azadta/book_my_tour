import type { IMonthlyRevenue } from "@/hooks/useOperatorDashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
interface BookingBarChartProps {
  monthlyRevenue?: IMonthlyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-gray-100/80 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ">
          {label}
        </p>
        <p className="text-base font-bold text-gray-900">
          {data.value}{" "}
          <span className="text-xs font-normal text-gray-500 ">Bookings</span>
        </p>
      </div>
    );
  }
  return null;
};
const BookingsBarChart = ({ monthlyRevenue = [] }: BookingBarChartProps) => {
  const formattedData = monthlyRevenue.map((item) => ({
    ...item,
    name: `${monthNames[item.month - 1]} ${item.year}`,
  }));

  const totalPeriodBookings = formattedData.reduce(
    (acc, curr) => acc + (curr.totalBookings || 0),
    0,
  );
  return (
    <div className="w-full bg-white p-6 rounded-3xl shadow-xs border border-gray-100/80 flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className=" text-lg font-bold text-gray-900 tracking-tight">
            Monthly Bookings Count
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Overview of reservation volume over time
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200/60">
          Total: {totalPeriodBookings}
        </span>
      </div>

      <div className="w-full h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={"0.95"} />
                <stop offset="100%" stopColor="#C2410C" stopOpacity={"0.85"} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              stroke="#9CA3AF"
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(243,244,246,0.5)" }}
            />
            <Bar
              dataKey="totalBookings"
              name="Bookings"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingsBarChart;
