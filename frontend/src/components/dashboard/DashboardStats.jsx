import React from 'react';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-card p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="text-muted-foreground">{icon}</div>
    </div>
  </div>
);

const DashboardStats = ({ data }) => {
  const stats = {
    totalUsers: (data.customers?.length || 0) + (data.guides?.length || 0) + (data.agencies?.length || 0),
    totalBookings: data.bookings?.length || 0,
    totalRevenue: data.bookings?.reduce((acc, booking) => acc + (booking.amount || 0), 0) || 0,
    activePackages: data.packages?.length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon="👥"
      />
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings}
        icon="📅"
      />
      <StatCard
        title="Active Packages"
        value={stats.activePackages}
        icon="🎯"
      />
    </div>
  );
};

export default DashboardStats;

