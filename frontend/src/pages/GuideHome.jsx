import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ViewPendingCustomers from "../components/ViewPendingCustomers";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const GuideHome = () => {
  const [guide, setGuide] = useState(null);
  const [reviews, setRevDetails] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const guideId = jwtDecode(localStorage.getItem("token")).id;

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/guides/${guideId}`
        );
        setGuide(response.data.guide);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/reviews/guides/${guideId}`
        );
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/bookings/guides/${guideId}`
        );
        const bookingData = res.data;

        const pendingBookings = bookingData.filter(
          (booking) => booking.status === "pending"
        ).length;
        const confirmedBookings = bookingData.filter(
          (booking) => booking.status === "confirmed"
        ).length;
        const canceledBookings = bookingData.filter(
          (booking) => booking.status === "cancelled"
        ).length;

        setBookings(bookingData);
        setPendingCount(pendingBookings);
        setConfirmedCount(confirmedBookings);
        setCanceledCount(canceledBookings);
        setTotalCount(bookingData.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchReviews();
    fetchGuideData();
    fetchBookingsData();
  }, [guideId]);

  const bookingData = [
    { name: "Pending", value: pendingCount },
    { name: "Confirmed", value: confirmedCount },
    { name: "Cancelled", value: canceledCount },
  ];

  const COLORS = ["#FFBB28", "#00C49F", "#FF8042"];

  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-lg mb-6">
        <div className="flex-1">
          <Link to="/guideHome" className="btn btn-ghost normal-case text-xl">
            Guide Home
          </Link>
        </div>
        <div className="flex-none">
          <Link to="/GuideProfilePage" className="btn btn-primary">
            Profile Page
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Booking Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="stats shadow mt-6">
              <div className="stat">
                <div className="stat-title">Total Bookings</div>
                <div className="stat-value">{totalCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Pending</div>
                <div className="stat-value">{pendingCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Confirmed</div>
                <div className="stat-value">{confirmedCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Cancelled</div>
                <div className="stat-value">{canceledCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.customerName}</td>
                      <td>
                        <span
                          className={`badge ${
                            booking.status === "confirmed"
                              ? "badge-success"
                              : booking.status === "pending"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Reviews</h2>
            {reviews && reviews.length > 0 ? (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li key={review._id} className="bg-base-200 p-4 rounded-lg">
                    <p className="font-bold">{review.customerName}</p>
                    <p className="mt-2">{review.comment}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400 mr-2">★</span>
                      <span>{review.rating} / 5</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base-content opacity-70">
                No reviews available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideHome;
