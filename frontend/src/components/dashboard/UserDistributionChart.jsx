/** @format */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const UserDistributionChart = ({ data }) => {
  const processUserData = (data) => {
    const { customers = [], guides = [], agencies = [] } = data;

    return [
      { name: "Customers", value: customers.length },
      { name: "Guides", value: guides.length },
      { name: "Agencies", value: agencies.length },
    ].filter((item) => item.value > 0);
  };

  const distribution = processUserData(data);

  // Define colors for different user types
  const COLORS = {
    Customers: "#4ade80", // green
    Guides: "#3b82f6", // blue
    Agencies: "#f59e0b", // amber
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = distribution.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-500">{`${((payload[0].value / total) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // If no data, show placeholder
  if (!distribution.length) {
    return (
      <div className="rounded-lg border bg-card p-6 h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">No user data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
              dataKey="value"
            >
              {distribution.map((entry, index) => (
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
