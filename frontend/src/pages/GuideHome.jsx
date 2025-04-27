import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
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

  const COLORS = ["#4169E1", "#1a365d", "#2d3748"]; // Updated colors to match style guide

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      <nav className="navbar bg-white shadow-lg mb-6">
        <div className="flex-1">
          <Link to="/guideHome" className="btn btn-ghost normal-case text-xl text-[#1a365d]">
            Guide Home
          </Link>
        </div>
        <div className="flex-none">
          <Link
            to="/GuideProfilePage"
            className="px-6 py-2 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300"
          >
            Profile Page
          </Link>
        </div>
      </nav>

      <motion.main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-white shadow-lg mb-6 border border-gray-100"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-white shadow-lg mb-6 border border-gray-100"
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4 text-[#1a365d]">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-[#2d3748]">Customer</th>
                    <th className="text-[#2d3748]">Status</th>
                    <th className="text-[#2d3748]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="text-[#2d3748]">{booking.customerName}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            booking.status === "confirmed"
                              ? "bg-[#1a365d]"
                              : booking.status === "pending"
                              ? "bg-[#4169E1]"
                              : "bg-[#2d3748]"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="px-4 py-1 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-white shadow-lg mt-6 border border-gray-100"
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title text-2xl text-[#1a365d]">Reviews</h2>

              <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-yellow-700 font-bold mr-1">
                  {guideData && guideData.ratings && guideData.ratings.averageRating > 0
                    ? guideData.ratings.averageRating.toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-yellow-700">★</span>
                <span className="text-gray-600 ml-2 text-sm">
                  ({guideData && guideData.ratings ? guideData.ratings.numberOfReviews : 0} {guideData && guideData.ratings && guideData.ratings.numberOfReviews === 1 ? "rating" : "ratings"})
                </span>
              </div>
            </div>
            {reviews && reviews.length > 0 ? (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li key={review._id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all duration-300">
                    <p className="font-bold text-[#1a365d]">{review.customerName}</p>
                    <p className="mt-2 text-[#2d3748]">{review.comment}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-[#4169E1] mr-2">★</span>
                      <span className="text-[#2d3748]">{review.rating} / 5</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#2d3748] opacity-70">
                No reviews available.
              </p>
            )}
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default GuideHome;
