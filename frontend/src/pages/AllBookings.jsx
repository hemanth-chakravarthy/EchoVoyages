/** @format */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaHourglassHalf,
  FaBan,
  FaEye,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const guideId = jwtDecode(localStorage.getItem("token")).id;
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${apiUrl}/bookings/guides/${guideId}`);
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [guideId]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      if (!bookingId) {
        setError("Invalid booking ID");
        return;
      }

      const bookingResponse = await fetch(`${apiUrl}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!bookingResponse.ok) {
        throw new Error(
          `Failed to fetch booking: ${bookingResponse.statusText}`
        );
      }

      const bookingData = await bookingResponse.json();

      if (!bookingData || !bookingData.customerId) {
        throw new Error("Invalid booking data received");
      }

      setSelectedBooking(bookingData);
      setStatus(bookingData.status);

      const customerResponse = await fetch(
        `${apiUrl}/customers/${bookingData.customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!customerResponse.ok) {
        throw new Error("Failed to fetch customer details");
      }

      const customerData = await customerResponse.json();
      setCustomer(customerData);
    } catch (error) {
      console.error("Error in fetchBookingDetails:", error);
      setError(error.message || "Failed to fetch booking details");
      setIsModalOpen(false);
    }
  };

  const handleViewBooking = async (bookingId) => {
    setError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages
    if (bookingId) {
      setIsModalOpen(true);
      await fetchBookingDetails(bookingId);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await fetch(`${apiUrl}/bookings/${selectedBooking._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setSuccessMessage(`Booking status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchBookings(); // Refresh the bookings list
      fetchBookingDetails(selectedBooking._id); // Refresh modal data
    } catch (error) {
      setError("Failed to update status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f3f6f8] font-['Inter',sans-serif] text-[#000000E6]"
    >
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#000000E6]">
            Booking Management
          </h1>
          <span className="text-[#666666]">
            Total Bookings: {bookings.length}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-[#00000014]"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#EEF3F8]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#000000E6]">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#000000E6]">
                    Booking Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#000000E6]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#000000E6]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00000014]">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-[#EEF3F8] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-[#0a66c2] flex items-center justify-center text-white">
                          {booking.customerImage ? (
                            <img
                              src={booking.customerImage}
                              alt={booking.customerName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <FaUser size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#000000E6]">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-[#666666]">
                            ID: {booking._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[#666666]">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                        ${
                          booking.status === "confirmed"
                            ? "bg-[#057642] text-white"
                            : booking.status === "pending"
                              ? "bg-[#0a66c2] text-white"
                              : "bg-[#666666] text-white"
                        }`}
                      >
                        {booking.status === "confirmed" && (
                          <FaCheckCircle className="mr-1" />
                        )}
                        {booking.status === "pending" && (
                          <FaHourglassHalf className="mr-1" />
                        )}
                        {booking.status === "cancelled" && (
                          <FaBan className="mr-1" />
                        )}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewBooking(booking._id)}
                        className="inline-flex items-center px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#00000014]">
                  <h2 className="text-xl font-semibold text-[#000000E6]">
                    Booking Details
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#666666] hover:text-[#000000E6] transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {successMessage && (
                  <div className="bg-[#057642] bg-opacity-10 text-[#057642] p-4 rounded-lg my-4 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    {successMessage}
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-[#0a66c2] flex items-center justify-center text-white">
                      {customer?.profileImage ? (
                        <img
                          src={customer.profileImage}
                          alt={customer?.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser size={32} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#000000E6]">
                        {selectedBooking.customerName}
                      </h3>
                      <p className="text-[#666666]">Customer Profile</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#EEF3F8] p-4 rounded-lg">
                      <p className="text-sm text-[#666666]">Booking ID</p>
                      <p className="font-medium text-[#000000E6]">
                        {selectedBooking._id}
                      </p>
                    </div>
                    {customer && (
                      <>
                        <div className="bg-[#EEF3F8] p-4 rounded-lg">
                          <div className="flex items-center">
                            <FaPhoneAlt className="text-[#0a66c2] mr-2" />
                            <div>
                              <p className="text-sm text-[#666666]">Phone</p>
                              <p className="font-medium text-[#000000E6]">
                                {customer.phno}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#EEF3F8] p-4 rounded-lg">
                          <div className="flex items-center">
                            <FaEnvelope className="text-[#0a66c2] mr-2" />
                            <div>
                              <p className="text-sm text-[#666666]">Email</p>
                              <p className="font-medium text-[#000000E6]">
                                {customer.gmail}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="text-sm font-medium text-[#666666] block mb-2">
                      Update Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => updateStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#00000014] text-[#000000E6] font-['system-ui'] text-sm
                        hover:bg-[#EEF3F8] focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent transition-colors"
                    >
                      <option
                        value="pending"
                        className="py-2 text-[#666666] hover:bg-[#EEF3F8]"
                      >
                        Pending
                      </option>
                      <option
                        value="confirmed"
                        className="py-2 text-[#057642] hover:bg-[#EEF3F8]"
                      >
                        Confirmed
                      </option>
                      <option
                        value="cancelled"
                        className="py-2 text-[#666666] hover:bg-[#EEF3F8]"
                      >
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default AllBookings;
