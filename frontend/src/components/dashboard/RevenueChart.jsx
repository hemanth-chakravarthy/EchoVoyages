// import React from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const processRevenueData = (bookings = []) => {
//   console.log('Processing revenue data:', bookings);
  
//   const revenueByMonth = bookings.reduce((acc, booking) => {
//     if (!booking || !booking.date || !booking.amount) {
//       console.warn('Invalid booking data for revenue:', booking);
//       return acc;
//     }

//     const date = new Date(booking.date);
//     if (!isNaN(date.getTime())) {
//       const month = date.toLocaleString('default', { month: 'short' });
//       const amount = parseFloat(booking.amount);
//       if (!isNaN(amount)) {
//         acc[month] = (acc[month] || 0) + amount;
//       } else {
//         console.warn('Invalid amount in booking:', booking.amount);
//       }
//     } else {
//       console.warn('Invalid date in booking:', booking.date);
//     }
//     return acc;
//   }, {});

//   return Object.entries(revenueByMonth).map(([month, revenue]) => ({
//     month,
//     revenue: Number(revenue.toFixed(2)),
//   }));
// };

// const RevenueChart = ({ data = [] }) => {
//   const chartData = processRevenueData(data);
//   console.log('Processed revenue chart data:', chartData);

//   return (
//     <div className="bg-card p-4 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="revenue" stroke="#80b1d3" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default RevenueChart;