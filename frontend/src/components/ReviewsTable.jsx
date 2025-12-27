import { Link } from "react-router-dom";

const ReviewsTable = ({ reviews }) => {
  const now = new Date();
  const revsLast24Hours = reviews.filter((user) => {
    const revCreatedAt = new Date(user.createdAt);
    return now - revCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="m-4 text-xl">
        Reviews added in the last 24 hours: {revsLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Package</th>
              <th>Guide</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Reports</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={review._id}>
                <td>{index + 1}</td>
                <td>{review.customerName}</td>
                <td>{review.packageName || "N/A"}</td>
                <td>{review.guideName || "N/A"}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{new Date(review.date).toLocaleDateString()}</td>
                <td>{review.reports}</td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      className="btn btn-error btn-xs" 
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