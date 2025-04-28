/** @format */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProfileEditor from "../components/CustomerInfo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const id = getUserId();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        window.location.href = "/login";
        return;
      }

      setLoading(true);

      try {
        const customerResponse = await axios.get(
          `http://localhost:5000/customers/${id}`
        );
        setCustomer(customerResponse.data);

        const bookingsResponse = await axios.get(
          `http://localhost:5000/bookings/cust/${id}`
        );
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
      }}
    >
      {/* Navbar removed - now using RoleBasedNavbar from Layout component */}
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.main
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-bold text-center mb-16 text-[#1a365d] tracking-tight"
        >
          Customer Profile
        </motion.h1>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin mx-auto"></div>
            <p className="text-center text-xl text-[#1a365d] mt-4">
              Loading profile data...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8"
          >
            <ProfileEditor />

            {bookings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight">
                    Previous Bookings
                  </h2>
                  <select
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[#1a365d] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1] hover:border-[#4169E1]/30 transition-all duration-200"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings
                    .filter(
                      (booking) =>
                        statusFilter === "all" ||
                        booking.status === statusFilter
                    )
                    .map((booking) => (
                      <motion.div
                        key={booking._id}
                        whileHover={{
                          y: -5,
                          scale: 1.01,
                          boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)",
                        }}
                        className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                              {booking.packageName || "N/A"}
                            </h3>
                            <div className="text-[#2d3748] space-y-1">
                              <p>
                                <span className="font-medium">Guide:</span>{" "}
                                {booking.guideName || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Date:</span>{" "}
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                <span className="font-medium">Booking ID:</span>{" "}
                                <span className=" px-2 py-1 rounded-md  font-bold">
                                  {booking.bookingId || booking._id}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#1a365d]">
                              ₹{booking.totalPrice}
                            </p>
                            {/* <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span> */}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
}
