/** @format */

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export const BookingStatusChart = ({ data }) => {
  // Count bookings by status
  const statusCounts = data.bookings?.reduce((acc, booking) => {
    const status = booking.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Format data for the pie chart
  const chartData = Object.entries(statusCounts || {}).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    })
  );

  // Define colors for different statuses
  const COLORS = {
    Confirmed: "#4ade80", // green
    Pending: "#f59e0b", // amber
    Canceled: "#ef4444", // red
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-500">{`${((payload[0].value / chartData.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%`}</p>
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
        Booking Status Distribution
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={true}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || `hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
