/** @format */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const UserDistributionChart = ({ data }) => {
  const processUserData = (data) => {
    const { customers = [], guides = [], agencies = [] } = data;

    return [
      { name: "Customers", value: customers.length, color: "#111111" },
      { name: "Guides", value: guides.length, color: "#6b7280" },
      { name: "Agencies", value: agencies.length, color: "#a1a1aa" },
    ].filter((item) => item.value > 0);
  };

  const distribution = processUserData(data);
  const total = distribution.reduce((sum, entry) => sum + entry.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pct = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-[#111111] text-[#f5f3f0] px-4 py-3 text-[10px] font-bold uppercase tracking-widest shadow-lg">
          <p>{payload[0].name}</p>
          <p className="text-[#f5f3f0]/60 mt-1">
            {payload[0].value} — {pct}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (!distribution.length) {
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
          User Distribution
        </h3>
        <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">
          {total} Total
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-1/2 h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-black text-[#111111]">{total}</p>
            <p className="text-[9px] text-[#111111]/40 uppercase tracking-widest">
              Users
            </p>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="w-full lg:w-1/2 space-y-3">
          {distribution.map((entry, index) => {
            const pct = ((entry.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#111111]">
                    {entry.value}
                  </span>
                  <span className="text-[10px] font-bold text-[#111111]/30 w-10 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
