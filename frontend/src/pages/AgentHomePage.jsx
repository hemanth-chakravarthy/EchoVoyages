/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  FaChartPie,
  FaClipboardList,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";

const AgentHomePage = () => {
  const [requests, setRequests] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [bookingStats, setBookingStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const token = localStorage.getItem("token");
  const agentid = jwtDecode(token).id;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/requests/agen/${agentid}`
        );
        const data = await response.json();
        if (data && data.data) {
          setRequests(data.data);
        } else {
          console.error("No requests found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/reviews");
        const data = await response.json();
        if (data) {
          setReviews(data);
        } else {
          console.error("No reviews found.");
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    const fetchOutgoingGuideRequests = async () => {
      setLoadingRequests(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/guide-requests",
          {
            params: {
              agencyId: agentid,
              initiator: "agency", // Requests initiated by this agency
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOutgoingRequests(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch outgoing guide requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    const fetchBookingStats = async () => {
      setLoadingStats(true);
      try {
        // Fetch all bookings
        const response = await axios.get("http://localhost:5000/bookings");

        if (response.data && response.data.data) {
          // Count bookings by status
          const bookings = response.data.data;

          // Initialize counters
          let pending = 0;
          let confirmed = 0;
          let canceled = 0;

          // Count bookings by status
          bookings.forEach((booking) => {
            if (booking.status === "pending") pending++;
            else if (booking.status === "confirmed") confirmed++;
            else if (booking.status === "canceled") canceled++;
          });

          // Create data for pie chart
          const stats = [
            { name: "Pending", value: pending, color: "#FFC107" },
            { name: "Confirmed", value: confirmed, color: "#4CAF50" },
            { name: "Canceled", value: canceled, color: "#F44336" },
          ];

          setBookingStats(stats);
          console.log("Booking stats:", stats);
        }
      } catch (error) {
        console.error("Failed to fetch booking statistics:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchRequests();
    fetchReviews();
    fetchOutgoingGuideRequests();
    fetchBookingStats();
  }, [agentid, token]);

  const handleCancelRequest = async (requestId) => {
    try {
      // Delete the request from the database
      await axios.delete(`http://localhost:5000/guide-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the request from the local state
      setOutgoingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      toast.success("Request cancelled successfully");
    } catch (err) {
      console.error("Error cancelling guide request:", err);
      toast.error("Failed to cancel request");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f3f6f8]"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0a66c2] mb-2">
            Agency Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, manage your bookings and requests
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {bookingStats.map((stat) => (
            <motion.div
              key={stat.name}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.name}</p>
                  <h3 className="text-2xl font-bold text-[#0a66c2]">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  {stat.name === "Pending" && (
                    <FaRegClock className="text-[#FFC107] text-xl" />
                  )}
                  {stat.name === "Confirmed" && (
                    <FaCheckCircle className="text-[#4CAF50] text-xl" />
                  )}
                  {stat.name === "Canceled" && (
                    <FaTimesCircle className="text-[#F44336] text-xl" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaChartPie className="text-[#0a66c2] text-xl" />
              <h2 className="text-xl font-semibold text-[#0a66c2]">
                Booking Distribution
              </h2>
            </div>
            {loadingStats ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a66c2]"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {bookingStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Recent Requests Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaClipboardList className="text-[#0a66c2] text-xl" />
                <h2 className="text-xl font-semibold text-[#0a66c2]">
                  Recent Requests
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {requests.slice(0, 3).map((req) => (
                <motion.div
                  key={req._id}
                  whileHover={{ x: 5 }}
                  className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {req.packageName}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-[#0a66c2]" />
                          {req.customerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[#0a66c2]" />
                          {new Date(req.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/requests/${req._id}`}
                      className="px-4 py-2 text-sm font-medium text-[#0a66c2] hover:bg-[#0a66c2]/10 rounded-md transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Full Request List */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FaEnvelope className="text-[#0a66c2] text-xl" />
            <h2 className="text-xl font-semibold text-[#0a66c2]">
              All Booking Requests
            </h2>
          </div>

          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {req.packageName}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-[#0a66c2]" />
                        <span>{req.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#0a66c2]" />
                        <span>{new Date(req.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mt-2">{req.message}</p>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        to={`/requests/${req._id}`}
                        className="inline-flex items-center px-4 py-2 bg-[#0a66c2] text-white rounded-md hover:bg-[#084a8d] transition-colors"
                      >
                        View Details <FaArrowRight className="ml-2 text-sm" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FaClipboardList className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-lg">No booking requests available</p>
            </div>
          )}
        </section>
      </motion.main>
    </motion.div>
  );
};

export default AgentHomePage;
