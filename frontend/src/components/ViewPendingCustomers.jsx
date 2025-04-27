import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const ViewPendingCustomers = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const guideId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/bookings/guides/${guideId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // if (!response.ok) {
        //     throw new Error('No bookings.');
        // }

        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (guideId) {
      fetchBookings();
    }
  }, [guideId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-6 bg-white shadow-lg rounded p-6 text-black"
    style={{ width: "70%" }}>
      <h1 className="text-2xl font-bold mb-4 text-blue-800">All Bookings</h1>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <h2>{booking.customerName}</h2>
              <p>Booking ID: <span className="bg-yellow-100 px-2 py-1 rounded-md text-yellow-800 font-medium">{booking.bookingId || booking._id}</span></p>
              <p>Status: {booking.status}</p>
              <Link to={`/bookings/${booking._id}`}>
                <button>View</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings.</p>
      )}
    </div>
  );
};

export default ViewPendingCustomers;
