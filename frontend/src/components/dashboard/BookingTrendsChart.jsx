/** @format */

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const BookingTrendsChart = ({ data }) => {
  const processBookingsByMonth = () => {
    if (!data.bookings?.length) return [];

    const monthlyData = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleString("default", { month: "short" });
      monthlyData[monthKey] = { month: monthName, bookings: 0 };
    }

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
  const maxBookings = Math.max(...chartData.map((d) => d.bookings), 1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111111] text-[#f5f3f0] px-4 py-3 text-[10px] font-bold uppercase tracking-widest shadow-lg">
          <p>{label}</p>
          <p className="text-[#f5f3f0]/60 mt-1">
            {payload[0].value} Bookings
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="border border-[#111111]/10 bg-[#ffffff] p-6 md:p-8 h-[380px] flex items-center justify-center">
        <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
          No booking data available
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#111111]/10 bg-[#ffffff] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50">
          Booking Trends
        </h3>
        <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">
          Last 6 Months
        </span>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#11111110" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fill: "#11111160" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              domain={[0, Math.ceil(maxBookings * 1.2)]}
              tick={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fill: "#11111160" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#111111"
              strokeWidth={2}
              dot={{ fill: "#ffffff", stroke: "#111111", strokeWidth: 2, r: 4 }}
              activeDot={{ fill: "#111111", stroke: "#ffffff", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
