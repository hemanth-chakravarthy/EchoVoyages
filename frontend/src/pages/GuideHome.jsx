/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiUrl from "../utils/api.js";
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
import { FaChartBar, FaBox, FaStar, FaUser, FaComments } from "react-icons/fa";

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
  console.log(bookings);
  useEffect(() => {
    setIsLoading(true);

    const fetchGuideData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/reviews/guides/${guideId}/details`
        );
        setGuide(response.data.guide);
        setRevDetails(response.data.review || []);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/bookings/guides/${guideId}`);
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
        const response = await axios.get(
          `${apiUrl}/guides/${guideId}/assigned-packages`
        );
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
      fetchPackageData(),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [guideId]);

  const bookingData = [
    { name: "Pending", value: pendingCount },
    { name: "Confirmed", value: confirmedCount },
    { name: "Cancelled", value: canceledCount },
  ];

  const COLORS = ["#4169E1", "#1a365d", "#2d3748"]; // Professional navy theme colors

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-[#f3f6f8] font-['Inter',sans-serif]"
    >
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a66c2]"></div>
            <p className="mt-4 text-[#0a66c2]">Loading statistics...</p>
          </div>
        </div>
      )}

      <motion.main className="max-w-[90%] mx-auto px-4 py-8 relative z-10">
        {/* Booking Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-8 w-full"
        >
          <div className="card-body">
            <div className="flex items-center mb-6">
              <FaChartBar className="text-[#0a66c2] text-2xl mr-3" />
              <h2 className="text-2xl font-semibold text-gray-700">
                Booking Statistics
              </h2>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Total Bookings</div>
                <div className="text-2xl font-bold text-[#0a66c2]">
                  {totalCount}
                </div>
              </div>
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Pending</div>
                <div className="text-2xl font-bold text-[#0a66c2]">
                  {pendingCount}
                </div>
              </div>
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Confirmed</div>
                <div className="text-2xl font-bold text-[#1a365d]">
                  {confirmedCount}
                </div>
              </div>
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">Cancelled</div>
                <div className="text-2xl font-bold text-[#2d3748]">
                  {canceledCount}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#0a66c2" />
                    <YAxis stroke="#0a66c2" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#0a66c2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#1a365d"
                      dataKey="value"
                    >
                      {bookingData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assigned Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <FaBox className="text-[#0a66c2] text-2xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-700">
              My Assigned Packages
            </h2>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-[#f3f6f8] rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="h-48 overflow-hidden">
                    {pkg.image && pkg.image.length > 0 ? (
                      <img
                        src={
                          pkg.image[0].startsWith("http")
                            ? pkg.image[0]
                            : `${apiUrl}${pkg.image[0]}`
                        }
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaBox className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {pkg.description}
                    </p>
                    <Link
                      to={`/packages/${pkg._id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#0a66c2]/90 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaBox className="text-[#0a66c2] text-4xl mx-auto mb-4 opacity-50" />
              <p className="text-gray-600">No packages assigned yet.</p>
            </div>
          )}
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-8 w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaComments className="text-[#0a66c2] text-2xl mr-3" />
              <h2 className="text-2xl font-semibold text-gray-700">Reviews</h2>
            </div>

            <div className="flex items-center bg-[#f3f6f8] px-4 py-2 rounded-lg">
              <FaStar className="text-[#0a66c2] mr-2" />
              <span className="font-bold text-gray-700">
                {guideData?.ratings?.averageRating > 0
                  ? guideData.ratings.averageRating.toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-gray-600 ml-2">
                ({guideData?.ratings?.numberOfReviews || 0} ratings)
              </span>
            </div>
          </div>

          {/* Reviews Section Content */}
          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#f3f6f8] p-6 rounded-lg hover:shadow-md transition-all duration-300 h-[200px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-[#0a66c2] flex items-center justify-center text-white mr-3">
                        {review.customerImage ? (
                          <img
                            src={review.customerImage}
                            alt={review.customerName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-700 truncate">
                          {review.customerName}
                        </h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`${
                                index < review.rating
                                  ? "text-[#FFD700]"
                                  : "text-gray-300"
                              } w-4 h-4`}
                            />
                          ))}
                          <span className="text-gray-600 text-sm ml-2">
                            ({review.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaComments className="text-[#0a66c2] text-4xl mx-auto mb-4 opacity-50" />
              <p className="text-gray-600">No reviews available yet.</p>
            </div>
          )}
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default GuideHome;
