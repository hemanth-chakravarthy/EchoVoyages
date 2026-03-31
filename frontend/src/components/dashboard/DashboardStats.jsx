import { FaUsers, FaCalendarAlt, FaBox, FaRupeeSign } from 'react-icons/fa';

const StatCard = ({ title, value, icon: Icon, sublabel }) => (
  <div className="border border-[#111111]/10 bg-[#ffffff] p-6 md:p-8 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-bold tracking-[0.2em] text-[#111111]/40 uppercase mb-3">{title}</p>
        <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-[#111111]">{value}</h3>
        {sublabel && (
          <p className="text-[9px] text-[#111111]/30 uppercase tracking-widest mt-2">{sublabel}</p>
        )}
      </div>
      <div className="w-12 h-12 flex items-center justify-center border border-[#111111]/10 text-[#111111]/40">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={FaUsers}
        sublabel="Across all roles"
      />
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings}
        icon={FaCalendarAlt}
        sublabel="All time"
      />
      <StatCard
        title="Active Packages"
        value={stats.activePackages}
        icon={FaBox}
        sublabel="Currently listed"
      />
      <StatCard
        title="Total Revenue"
        value={`₹${stats.totalRevenue.toLocaleString()}`}
        icon={FaRupeeSign}
        sublabel="From all bookings"
      />
    </div>
  );
};

export default DashboardStats;
