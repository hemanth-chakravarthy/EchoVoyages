import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5'];

export const BookingsChart = ({ data = [] }) => {
  const bookingsByMonth = data.reduce((acc, booking) => {
    const date = new Date(booking.date);
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(bookingsByMonth).map(([month, count]) => ({
    month,
    bookings: count,
  }));

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Bookings by Month</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#8dd3c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const UserTypeDistribution = ({ data }) => {
  // Ensure we have arrays for each user type, defaulting to empty arrays if undefined
  const { customers = [], guides = [], agencies = [] } = data;
  
  // Create distribution data
  const distribution = [
    { name: 'Customers', value: customers.length },
    { name: 'Guides', value: guides.length },
    { name: 'Agencies', value: agencies.length }
  ].filter(item => item.value > 0); // Only include non-zero values

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

export const RevenueChart = ({ data = [] }) => {
  const revenueByMonth = data.reduce((acc, booking) => {
    const date = new Date(booking.date);
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + (parseFloat(booking.amount) || 0);
    }
    return acc;
  }, {});

  const chartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue: Number(revenue.toFixed(2)),
  }));

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#80b1d3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};