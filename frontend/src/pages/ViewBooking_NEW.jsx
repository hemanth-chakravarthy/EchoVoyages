/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import apiUrl from "../utils/api.js";

const ViewBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booking.");
        }

        const data = await response.json();
        setBooking(data);
        setStatus(data.status);

        const customerResponse = await fetch(
          `${apiUrl}/customers/${data.customerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!customerResponse.ok) {
          throw new Error("Failed to fetch customer details.");
        }

        const customerData = await customerResponse.json();
        setCustomer(customerData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, token]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      const fetchResponse = await fetch(`${apiUrl}/bookings/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        setBooking(data);
        setStatus(data.status);
      }

      setSuccessMessage(`Booking status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateStatus(newStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !booking || !booking.guideId) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-white">!</span>
          </div>
          <p className="text-xl font-bold text-[#1a1a1a] mb-4">Error</p>
          <p className="text-sm text-black/60">
            {error || "No booking found or this booking is not associated with a guide."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d2d2d] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-12 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/60 hover:text-[#1a1a1a] transition-colors mb-8"
        >
          <FaArrowLeft /> Back
        </button>

        <span className="block text-xs font-bold tracking-[0.3em] text-black/40 uppercase mb-4">
          001 / Booking Details
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">
          Booking #{booking.bookingId || booking._id}
        </h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <div className="bg-[#4CAF50] text-white p-6 flex items-center gap-4">
            <FaCheckCircle className="text-2xl flex-shrink-0" />
            <p className="font-bold uppercase tracking-wider text-sm">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-black/5">
          {/* Customer Information */}
          <div className="p-8 md:p-12 border-b border-black/5">
            <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-8">
              002 / Customer Information
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-4 border-[#1a1a1a] pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className="text-[#1a1a1a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-black/40">
                    Customer Name
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a1a]">{booking.customerName}</p>
              </div>

              {customer && (
                <>
                  <div className="border-l-4 border-[#1a1a1a] pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FaPhone className="text-[#1a1a1a]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-black/40">
                        Phone Number
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-[#1a1a1a]">{customer.phno}</p>
                  </div>

                  <div className="border-l-4 border-[#1a1a1a] pl-6 md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <FaEnvelope className="text-[#1a1a1a]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-black/40">
                        Email Address
                      </span>
                    </div>
                    <p className="text-xl font-bold text-[#1a1a1a]">{customer.gmail}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status Management */}
          <div className="p-8 md:p-12">
            <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-8">
              003 / Status Management
            </span>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/40 mb-3">
                  Current Status
                </p>
                <span
                  className={`inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                    booking.status === "confirmed"
                      ? "bg-[#4CAF50] text-white"
                      : booking.status === "pending"
                        ? "bg-[#FFC107] text-[#1a1a1a]"
                        : "bg-[#F44336] text-white"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex-1 max-w-md">
                <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-3">
                  Update Status
                </label>
                <select
                  id="status"
                  className="w-full px-4 py-3 bg-white border-2 border-black/10 text-sm font-semibold text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default ViewBooking;
