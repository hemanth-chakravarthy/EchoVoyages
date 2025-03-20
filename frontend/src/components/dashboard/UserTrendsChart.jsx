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

export const UserTrendsChart = ({ data }) => {
  // Process user data by month
  const processUsersByMonth = () => {
    if (
      !data.customers?.length &&
      !data.guides?.length &&
      !data.agencies?.length
    )
      return [];

    const monthlyData = {};

    // Initialize with last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleString("default", { month: "short" });
      monthlyData[monthKey] = {
        month: monthName,
        customers: 0,
        guides: 0,
        agencies: 0,
      };
    }

    // Process customers
    data.customers?.forEach((customer) => {
      if (!customer.createdAt) return;

      const createdAt = new Date(customer.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;

      // Count all users created up to each month
      Object.keys(monthlyData).forEach((key) => {
        if (key >= monthKey) {
          monthlyData[key].customers += 1;
        }
      });
    });

    // Process guides
    data.guides?.forEach((guide) => {
      if (!guide.createdAt) return;

      const createdAt = new Date(guide.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;

      // Count all guides created up to each month
      Object.keys(monthlyData).forEach((key) => {
        if (key >= monthKey) {
          monthlyData[key].guides += 1;
        }
      });
    });

    // Process agencies
    data.agencies?.forEach((agency) => {
      if (!agency.createdAt) return;

      const createdAt = new Date(agency.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;

      // Count all agencies created up to each month
      Object.keys(monthlyData).forEach((key) => {
        if (key >= monthKey) {
          monthlyData[key].agencies += 1;
        }
      });
    });

    return Object.values(monthlyData);
  };

  const chartData = processUsersByMonth();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Customers: {payload[0].value}
          </p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Guides: {payload[1].value}
          </p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Agencies: {payload[2].value}
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
        <p className="text-muted-foreground">No user data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">
        User Growth Trends (Last 6 Months)
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
            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#4ade80"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Customers"
            />
            <Line
              type="monotone"
              dataKey="guides"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Guides"
            />
            <Line
              type="monotone"
              dataKey="agencies"
              stroke="#f59e0b"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Agencies"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
