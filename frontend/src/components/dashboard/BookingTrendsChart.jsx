/** @format */

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export const BookingTrendsChart = ({ data }) => {
  // Process booking data by month
  const processBookingsByMonth = () => {
    if (!data.bookings?.length) return [];

    const monthlyData = {};

    // Initialize with last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleString("default", { month: "short" });
      monthlyData[monthKey] = {
        month: monthName,
        bookings: 0,
      };
    }

    // Aggregate booking data
    data.bookings.forEach((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, "0")}`;

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].bookings += 1;
      }
    });

    return Object.values(monthlyData);
  };

  const chartData = processBookingsByMonth();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Bookings: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // If no data, show placeholder
  if (!chartData.length) {
    return (
      <div className="rounded-lg border bg-card p-6 h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">No booking data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">
        Booking Trends (Last 6 Months)
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bookings"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Bookings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
