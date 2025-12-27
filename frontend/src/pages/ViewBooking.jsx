/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import apiUrl from "../utils/api.js";

const ViewBooking = () => {
  const { bookingId } = useParams();
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

      // Refetch the booking data
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
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
        }}
      >
        <span className="loading loading-spinner loading-lg text-[#4169E1]"></span>
      </motion.div>
    );
  }

  if (error || !booking || !booking.guideId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
        }}
      >
        <div className="text-[#1a365d] text-xl">
          {error ||
            "No booking found or this booking is not associated with a guide."}
        </div>
      </motion.div>
    );
  }

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
      <motion.main
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{
            y: -5,
            scale: 1.01,
            boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)",
          }}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 max-w-3xl mx-auto p-6"
        >
          <h1 className="text-5xl font-bold text-[#1a365d] tracking-tight mb-8">
            Booking Details
          </h1>
          <h2 className="text-2xl font-bold text-[#2d3748] mb-4">
            Booking ID:{" "}
            <span className="bg-yellow-100 px-2 py-1 rounded-md text-yellow-800">
              {booking.bookingId || booking._id}
            </span>
          </h2>

          {successMessage && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="text-[#2d3748] leading-relaxed">
              <p className="text-sm font-medium opacity-70">Customer Name</p>
              <p className="text-xl font-semibold">{booking.customerName}</p>
            </div>
            <div className="text-[#2d3748] leading-relaxed">
              <p className="text-sm font-medium opacity-70">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-white ${
                  booking.status === "confirmed"
                    ? "bg-green-500"
                    : booking.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {booking.status}
              </span>
            </div>
            {customer && (
              <>
                <div className="text-[#2d3748] leading-relaxed">
                  <p className="text-sm font-medium opacity-70">
                    Customer Phone
                  </p>
                  <p className="text-xl font-semibold">{customer.phno}</p>
                </div>
                <div className="text-[#2d3748] leading-relaxed">
                  <p className="text-sm font-medium opacity-70">
                    Customer Email
                  </p>
                  <p className="text-xl font-semibold">{customer.gmail}</p>
                </div>
              </>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="status">
              <span className="text-[#2d3748] font-medium">Update Status</span>
            </label>
            <select
              id="status"
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default ViewBooking;
