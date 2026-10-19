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

const RevenueLineChart = ({ monthlyRevenue = [] }: RevenueLineChartProps) => {
  const formattedData = monthlyRevenue.map((item) => ({
    ...item,
    name: `${monthNames[item.month - 1]} ${item.year}`,
  }));
  return (
    <div className="w-full h-[420px] bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Monthly Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis
            stroke="#4f46e5"
            tickFormatter={(value) => `Rs\u00A0${value.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`}
          />

          <Tooltip formatter={(value) => [`Revenue: Rs ${value?.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            name="Revenue"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;
