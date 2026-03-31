import { Link } from "react-router-dom";

const ReviewsTable = ({ reviews }) => {
  const now = new Date();
  const revsLast24Hours = reviews.filter((user) => {
    const revCreatedAt = new Date(user.createdAt);
    return now - revCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="mb-6 px-1">
        <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">
          Reviews added in the last 24 hours: {revsLast24Hours.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Package</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Guide</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Comment</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Reports</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reviews.map((review, index) => (
              <tr key={review._id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-black/60">{index + 1}</td>
                <td className="px-4 py-4 text-sm font-medium text-[#1a1a1a]">{review.customerName}</td>
                <td className="px-4 py-4 text-sm text-black/70">{review.packageName || "N/A"}</td>
                <td className="px-4 py-4 text-sm text-black/70">{review.guideName || "N/A"}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#1a1a1a]">{review.rating}</td>
                <td className="px-4 py-4 text-sm text-black/70 max-w-xs truncate">{review.comment}</td>
                <td className="px-4 py-4 text-sm text-black/70">{new Date(review.date).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-sm font-semibold text-black/60">{review.reports}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      className="px-3 py-1 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b91c1c] transition-all" 
                      to={`/admin/reviews/delete/${review._id}`}
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

export default ReviewsTable;