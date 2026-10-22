import type { IMonthlyRevenue } from "@/hooks/useOperatorDashboard";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

interface RevenueLineChartProps {
  monthlyRevenue?: IMonthlyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const formattedVal = Number(data.value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-gray-100/80 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-base font-bold text-gray-900">
          Rs {formattedVal}{" "}
          <span className="text-xs font-normal text-gray-500 ">Revenue</span>
        </p>
      </div>
    );
  }
  return null;
};

const RevenueLineChart = ({ monthlyRevenue = [] }: RevenueLineChartProps) => {
  const formattedData = monthlyRevenue.map((item) => ({
    ...item,
    name: `${monthNames[item.month - 1]} ${item.year}`,
  }));

  const totalPeriodRevenue = formattedData.reduce(
    (acc, curr) => acc + (curr.totalRevenue || 0),
    0,
  );
  const formattedTotalRevenue = totalPeriodRevenue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div className="w-full  bg-white p-6 rounded-3xl shadow-xs border border-gray-100/80 flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Monthly Revenue Trend
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Overview of financial perfomance over time
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200/60">
          Total: Rs {formattedTotalRevenue}
        </span>
      </div>

      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
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
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              tickFormatter={(value) =>
                `Rs ${value.toLocaleString("en-IN", { notation: "compact", compactDisplay: "short" })}`
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="totalRevenue"
              name="Revenue"
              stroke="#FBBF24"
              strokeWidth={3}
              dot={{ r: 4, fill: "#FBBF24", strokeWidth: 2, stroke: "#FFF" }}
              activeDot={{
                r: 7,
                fill: "##FBBF24",
                strokeWidth: 2,
                stroke: "#FFF",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueLineChart;
