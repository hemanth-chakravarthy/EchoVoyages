import { FaUsers, FaCalendarAlt, FaBox } from 'react-icons/fa';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 md:p-8 border border-black/5 hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-3">{title}</p>
        <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1a1a1a]">{value}</h3>
      </div>
      <div className="w-12 h-12 flex items-center justify-center bg-black/5 text-[#1a1a1a]">
        <Icon className="text-xl" />
      </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={FaUsers}
      />
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings}
        icon={FaCalendarAlt}
      />
      <StatCard
        title="Active Packages"
        value={stats.activePackages}
        icon={FaBox}
      />
    </div>
  );
};

export default DashboardStats;

