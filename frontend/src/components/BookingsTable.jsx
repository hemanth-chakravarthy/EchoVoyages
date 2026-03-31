import { Link } from "react-router-dom";

const BookingsTable = ({ bookings }) => {
  const now = new Date();
  const booksLast24Hours = bookings.filter((user) => {
    const agentCreatedAt = new Date(user.createdAt);
    return now - agentCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="mb-6 px-1">
        <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">
          Bookings added in the last 24 hours: {booksLast24Hours.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-black/60">{index + 1}</td>
                <td className="px-4 py-4 text-sm">
                  <span className="bg-[#FFC107] px-3 py-1 text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                    {booking.bookingId || booking._id}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-black/70">{booking.bookingDate}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#1a1a1a]">{booking.totalPrice}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="px-3 py-1 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d2d2d] transition-all"
                      to={`/admin/bookings/${booking._id}`}
                    >
                      Show
                    </Link>
                    <Link
                      className="px-3 py-1 bg-[#4a4a4a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5a5a5a] transition-all"
                      to={`/admin/bookings/edit/${booking._id}`}
                    >
                      Update
                    </Link>
                    <Link
                      className="px-3 py-1 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b91c1c] transition-all"
                      to={`/admin/bookings/delete/${booking._id}`}
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;