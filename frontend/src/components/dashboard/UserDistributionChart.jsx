import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462'];

const processUserData = (data) => {
  console.log('Processing user distribution data:', data);
  
  const { customers = [], guides = [], agencies = [] } = data;
  
  return [
    { name: 'Customers', value: customers.length },
    { name: 'Guides', value: guides.length },
    { name: 'Agencies', value: agencies.length }
  ].filter(item => item.value > 0);
};

const UserDistributionChart = ({ data }) => {
  const distribution = processUserData(data);
  console.log('Processed distribution data:', distribution);

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {distribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserDistributionChart;