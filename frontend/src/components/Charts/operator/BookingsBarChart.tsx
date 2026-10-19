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
const BookingsBarChart = ({ monthlyRevenue = [] }: BookingBarChartProps) => {
  const formattedData = monthlyRevenue.map((item) => ({
    ...item,
    name: `${monthNames[item.month - 1]} ${item.year}`,
  }));
  return (
    <div className="w-full h-[400px] bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Monthly Bookings Count
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#10b981" allowDecimals={false} />
          <Tooltip formatter={(value) => [value, "Bookings"]} />
          <Bar
            dataKey="totalBookings"
            name="Bookings"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingsBarChart;
