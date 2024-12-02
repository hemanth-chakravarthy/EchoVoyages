import React from "react";
import { Link } from "react-router-dom";

const BookingsTable = ({ bookings }) => {
  const now = new Date();
  const booksLast24Hours = bookings.filter((user) => {
    const agentCreatedAt = new Date(user.createdAt); // Assuming `createdAt` is the timestamp field
    return now - agentCreatedAt < 24 * 60 * 60 * 1000; // Difference in milliseconds
  });

  return (
    <div>
      <div className="m-4 text-xl">
        Bookings added in the last 24 hours: {booksLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Date</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking._id}</td>
                <td>{booking.bookingDate}</td>
                <td>{booking.totalPrice}</td>
                <td>
                  <div className="linksPacks">
                    <Link
                      className="links"
                      to={`/admin/bookings/${booking._id}`}
                    >
                      Show
                    </Link>
                    <Link
                      className="links"
                      to={`/admin/bookings/edit/${booking._id}`}
                    >
                      Update
                    </Link>
                    <Link
                      className="links"
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
