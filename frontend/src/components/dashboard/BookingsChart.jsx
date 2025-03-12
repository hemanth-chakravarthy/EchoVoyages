// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const processBookingsData = (bookings = []) => {
//   console.log('Processing bookings data:', bookings);
  
//   const bookingsByMonth = bookings.reduce((acc, booking) => {
//     if (!booking || !booking.date) {
//       console.warn('Invalid booking data:', booking);
//       return acc;
//     }

//     const date = new Date(booking.date);
//     if (!isNaN(date.getTime())) {
//       const month = date.toLocaleString('default', { month: 'short' });
//       acc[month] = (acc[month] || 0) + 1;
//     } else {
//       console.warn('Invalid date in booking:', booking.date);
//     }
//     return acc;
//   }, {});

//   return Object.entries(bookingsByMonth).map(([month, count]) => ({
//     month,
//     bookings: count,
//   }));
// };

// const BookingsChart = ({ data = [] }) => {
//   const chartData = processBookingsData(data);
//   console.log('Processed chart data:', chartData);

//   return (
//     <div className="bg-card p-4 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Bookings by Month</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="bookings" fill="#8dd3c7" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default BookingsChart;