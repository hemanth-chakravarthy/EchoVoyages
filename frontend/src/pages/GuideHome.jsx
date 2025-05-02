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
import GuideEarnings from "../components/GuideEarnings";

const GuideHome = () => {
  const [guideData, setGuide] = useState(null);
  const [reviews, setRevDetails] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const guideId = jwtDecode(localStorage.getItem("token")).id;

  useEffect(() => {
    setIsLoading(true);

    const fetchGuideData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/guides/${guideId}/details`
        );
        setGuide(response.data.guide);
        setRevDetails(response.data.review || []);
      } catch (error) {
        console.error("Error fetching guide data:", error);
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

    const fetchPackageData = async () => {
      try {
        // Fetch packages assigned to this guide from the guide's assignedPackages array
        const response = await axios.get(`http://localhost:5000/guides/${guideId}/assigned-packages`);
        const packagesData = response.data.data || [];
        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    // Execute all fetch functions
    Promise.all([
      fetchGuideData(),
      fetchBookingsData(),
      fetchPackageData()
    ]).finally(() => {
      setIsLoading(false);
    });
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
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4169E1]"></div>
            <p className="mt-4 text-[#1a365d]">Loading statistics...</p>
          </div>
        </div>
      )}
      {/* Navbar removed - now using RoleBasedNavbar from Layout component */}

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
                      {bookingData.map((_, index) => (
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



        {/* Assigned Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-white shadow-lg mt-6 border border-gray-100"
        >
          <div className="card-body">
            <h2 className="card-title text-3xl mb-6 text-[#1a365d] text-center">My Assigned Packages</h2>

            {packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg._id} className="card bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <figure className="h-40 overflow-hidden">
                      {pkg.image && pkg.image.length > 0 ? (
                        <img
                          src={pkg.image[0].startsWith('http') ? pkg.image[0] : `http://localhost:5000${pkg.image[0]}`}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm">{pkg.avgRating ? pkg.avgRating.toFixed(1) : '0.0'}</span>
                          <span className="text-xs text-gray-500 ml-1">({pkg.reviewCount || 0})</span>
                        </div>
                        <span className="font-semibold">₹{pkg.price}</span>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pkg.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          pkg.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          pkg.status === 'canceled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pkg.status || 'pending'}
                        </span>
                        <Link
                          to={`/packages/${pkg._id}`}
                          className="text-sm text-[#4169E1] hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-[#2d3748] mb-2">No assigned packages</p>
                <p className="text-sm text-gray-500">
                  You haven't been assigned to any packages yet. Browse available packages and send requests to agencies.
                </p>
                <Link
                  to="/home"
                  className="mt-4 inline-block px-4 py-2 bg-[#4169E1] text-white rounded-md hover:bg-[#1a365d] transition-colors"
                >
                  Browse Packages
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Earnings Section */}
        {/* <GuideEarnings /> */}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
