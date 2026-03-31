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

export const UserTrendsChart = ({ data }) => {
  const processUsersByMonth = () => {
    if (
      !data.customers?.length &&
      !data.guides?.length &&
      !data.agencies?.length
    )
      return [];

    const monthlyData = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleString("default", { month: "short" });
      monthlyData[monthKey] = { month: monthName, customers: 0, guides: 0, agencies: 0 };
    }

    data.customers?.forEach((customer) => {
      if (!customer.createdAt) return;
      const createdAt = new Date(customer.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      Object.keys(monthlyData).forEach((key) => {
        if (key >= monthKey) monthlyData[key].customers += 1;
      });
    });

    data.guides?.forEach((guide) => {
      if (!guide.createdAt) return;
      const createdAt = new Date(guide.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      Object.keys(monthlyData).forEach((key) => {
        if (key >= monthKey) monthlyData[key].guides += 1;
      });
    });

    data.agencies?.forEach((agency) => {
      if (!agency.createdAt) return;
      const createdAt = new Date(agency.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      Object.keys(monthlyData).forEach((key) => {
        if (key >= monthKey) monthlyData[key].agencies += 1;
      });
    });

    return Object.values(monthlyData);
  };

  const chartData = processUsersByMonth();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111111] text-[#f5f3f0] px-4 py-3 text-[10px] font-bold uppercase tracking-widest shadow-lg">
          <p className="mb-2">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-[#f5f3f0]/60">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="border border-[#111111]/10 bg-[#ffffff] p-6 md:p-8 h-[380px] flex items-center justify-center">
        <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
          No user data available
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#111111]/10 bg-[#ffffff] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50">
          User Growth Trends
        </h3>
        <div className="flex items-center gap-4">
          {[
            { label: "Customers", color: "#111111" },
            { label: "Guides", color: "#6b7280" },
            { label: "Agencies", color: "#a1a1aa" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-2 h-2" style={{ backgroundColor: item.color }} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#111111]/40">
                {item.label}
              </span>
            </div>
          ))}
        </div>
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
              tick={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fill: "#11111160" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#111111"
              strokeWidth={2}
              dot={{ fill: "#ffffff", stroke: "#111111", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
              name="Customers"
            />
            <Line
              type="monotone"
              dataKey="guides"
              stroke="#6b7280"
              strokeWidth={2}
              dot={{ fill: "#ffffff", stroke: "#6b7280", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
              name="Guides"
            />
            <Line
              type="monotone"
              dataKey="agencies"
              stroke="#a1a1aa"
              strokeWidth={2}
              dot={{ fill: "#ffffff", stroke: "#a1a1aa", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
              name="Agencies"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
