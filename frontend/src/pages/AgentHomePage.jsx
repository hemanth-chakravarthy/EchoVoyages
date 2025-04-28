import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
        const response = await axios.get('http://localhost:5000/guide-requests', {
          params: {
            agencyId: agentid,
            initiator: 'agency' // Requests initiated by this agency
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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
        const response = await axios.get('http://localhost:5000/bookings');

        if (response.data && response.data.data) {
          // Count bookings by status
          const bookings = response.data.data;

          // Initialize counters
          let pending = 0;
          let confirmed = 0;
          let canceled = 0;

          // Count bookings by status
          bookings.forEach(booking => {
            if (booking.status === 'pending') pending++;
            else if (booking.status === 'confirmed') confirmed++;
            else if (booking.status === 'canceled') canceled++;
          });

          // Create data for pie chart
          const stats = [
            { name: 'Pending', value: pending, color: '#FFC107' },
            { name: 'Confirmed', value: confirmed, color: '#4CAF50' },
            { name: 'Canceled', value: canceled, color: '#F44336' }
          ];

          setBookingStats(stats);
          console.log('Booking stats:', stats);
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
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the request from the local state
      setOutgoingRequests(prevRequests =>
        prevRequests.filter(req => req._id !== requestId)
      );

      toast.success('Request cancelled successfully');
    } catch (err) {
      console.error('Error cancelling guide request:', err);
      toast.error('Failed to cancel request');
    }
  };

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

      <ToastContainer position="top-right" autoClose={3000} />

      <motion.main
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Booking Statistics Section */}
        <section className="mb-16">
          <h1 className="text-center font-bold text-5xl mb-12 tracking-tight flex justify-center items-center gap-1">
            <span className="text-black">Booking</span>
            <span className="bg-gradient-to-r from-[#1a365d] to-[#00072D] text-transparent bg-clip-text">Sta</span>
            <span className="text-black">tistics</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-6 text-center">
                Booking Status Overview
              </h2>

              {loadingStats ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a365d]"></div>
                </div>
              ) : bookingStats.length > 0 ? (
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {bookingStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-xl text-[#2d3748] h-64 flex items-center justify-center">
                  No booking data available.
                </p>
              )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {bookingStats.map((stat, index) => (
                <div
                  key={stat.name}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex items-center"
                  style={{ borderLeft: `6px solid ${stat.color}` }}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2d3748]">{stat.name} Bookings</h3>
                    <p className="text-3xl font-bold text-[#1a365d] mt-2">{stat.value}</p>
                  </div>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Booking Requests Section */}
          <h1 className="text-center font-bold text-5xl mb-12 tracking-tight flex justify-center items-center gap-1">
            <span className="text-black">Booking</span>
            <span className="bg-gradient-to-r from-[#1a365d] to-[#00072D] text-transparent bg-clip-text">Re</span>
            <span className="text-black">quests</span>
          </h1>

          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                  }}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">
                      {req.packageName}
                    </h2>
                    <p className="text-[#2d3748] mb-3">
                      <strong>Customer Name:</strong> {req.customerName}
                    </p>
                    <p className="text-[#2d3748] mb-3">
                      <strong>Status:</strong> {req.status}
                    </p>
                    <p className="text-[#2d3748] mb-3">
                      <strong>Request Date:</strong>{" "}
                      {new Date(req.date).toLocaleDateString()}
                    </p>
                    <p className="text-[#2d3748] mb-4">
                      <strong>Message:</strong> {req.message}
                    </p>
                    <div className="flex justify-end">
                      <Link to={`/requests/${req._id}`}>
                        <button className="bg-[#00072D] text-white font-bold py-3 px-6 rounded-full hover:bg-[#1a365d] transition-all duration-300 transform hover:scale-105">
                          View Request
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl text-[#2d3748]">
              No booking requests available for your packages.
            </p>
          )}
        </section>


      </motion.main>
    </motion.div>
  );
};

export default AgentHomePage;
