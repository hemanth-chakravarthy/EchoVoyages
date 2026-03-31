/** @format */

import { useEffect, useState } from "react";
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
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
    setError("");
    setSuccessMessage("");
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
      fetchBookings();
      fetchBookingDetails(selectedBooking._id);
    } catch {
      setError("Failed to update status");
    }
  };

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16 flex items-end justify-between">
          <div>
            <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
              005 / Booking Ledger
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
              Bookings
            </h1>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-[#111111]/50 uppercase">
            {bookings.length} Total
          </span>
        </div>

        {/* Table */}
        {bookings.length === 0 ? (
          <div className="border border-[#111111]/10 p-8 md:p-16 text-center">
            <FaCalendarAlt className="w-16 h-16 text-[#111111]/20 mx-auto mb-6" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
              No Bookings Found
            </h2>
            <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
              There are no bookings assigned to you yet.
            </p>
          </div>
        ) : (
          <div className="border border-[#111111]/10 bg-[#ffffff]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#111111]/10">
                    <th className="px-6 md:px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-[#111111]/50">
                      Customer
                    </th>
                    <th className="px-6 md:px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-[#111111]/50">
                      Date
                    </th>
                    <th className="px-6 md:px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-[#111111]/50">
                      Status
                    </th>
                    <th className="px-6 md:px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-[#111111]/50">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-[#111111]/5 hover:bg-[#f0eeeb] transition-colors"
                    >
                      <td className="px-6 md:px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 border border-[#111111]/20 flex items-center justify-center text-[#111111] overflow-hidden shrink-0">
                            {booking.customerImage ? (
                              <img
                                src={booking.customerImage}
                                alt={booking.customerName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FaUser className="text-xl text-[#111111]/30" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                              {booking.customerName}
                            </p>
                            <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mt-1">
                              ID: {booking._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <div className="flex items-center gap-2 text-[#111111]/70">
                          <FaCalendarAlt className="text-[#111111]/30 text-xs" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <span
                          className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 w-fit ${
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-600 border border-green-500/30"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30"
                              : "bg-red-500/10 text-red-600 border border-red-500/30"
                          }`}
                        >
                          {booking.status === "confirmed" && (
                            <FaCheckCircle className="text-xs" />
                          )}
                          {booking.status === "pending" && (
                            <FaHourglassHalf className="text-xs" />
                          )}
                          {booking.status === "cancelled" && (
                            <FaBan className="text-xs" />
                          )}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <button
                          onClick={() => handleViewBooking(booking._id)}
                          className="bg-[#111111] text-[#f5f3f0] py-2 px-5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 flex items-center gap-2"
                        >
                          <FaEye className="text-xs" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#ffffff] border border-[#111111]/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#111111]/10">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111]">
                    Booking Details
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#111111]/50 hover:text-[#111111] transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>

                {successMessage && (
                  <div className="bg-green-500/10 text-green-600 p-4 m-6 md:m-8 mb-0 flex items-center gap-3 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest">
                    <FaCheckCircle />
                    {successMessage}
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 border border-[#111111]/20 flex items-center justify-center text-[#111111] overflow-hidden shrink-0">
                      {customer?.profileImage ? (
                        <img
                          src={customer.profileImage}
                          alt={customer?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-2xl text-[#111111]/30" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-[#111111]">
                        {selectedBooking.customerName}
                      </h3>
                      <p className="text-[10px] text-[#111111]/50 uppercase tracking-widest mt-1">
                        Customer Profile
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#f0eeeb] p-4">
                      <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                        Booking ID
                      </p>
                      <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                        {selectedBooking._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    {customer && (
                      <>
                        <div className="bg-[#f0eeeb] p-4 flex items-center gap-3">
                          <FaPhoneAlt className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-1">
                              Phone
                            </p>
                            <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                              {customer.phno}
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#f0eeeb] p-4 flex items-center gap-3">
                          <FaEnvelope className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-1">
                              Email
                            </p>
                            <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                              {customer.gmail}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                      Update Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => updateStatus(e.target.value)}
                      className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                    >
                      <option value="pending" className="bg-[#ffffff]">
                        PENDING
                      </option>
                      <option value="confirmed" className="bg-[#ffffff]">
                        CONFIRMED
                      </option>
                      <option value="cancelled" className="bg-[#ffffff]">
                        CANCELLED
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AllBookings;
