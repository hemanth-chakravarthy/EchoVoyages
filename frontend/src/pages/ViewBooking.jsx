import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewBooking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchBooking = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/bookings/${bookingId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch booking.");
      }

      const data = await response.json();
      setBooking(data);
      setStatus(data.status);

      const customerResponse = await fetch(
        `http://localhost:5000/customers/${data.customerId}`,
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

  useEffect(() => {
    fetchBooking();
  }, [bookingId, token]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      await fetchBooking(); // Refetch the booking data
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
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!booking || !booking.guideId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            No booking found or this booking is not associated with a guide.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Booking Details
            </h1>
            <h2 className="text-xl font-semibold mb-4">
              Booking ID: {booking._id}
            </h2>
            {successMessage && (
              <div className="alert alert-success mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-base-content/70">
                  Customer Name
                </p>
                <p className="text-lg font-semibold">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-base-content/70">
                  Status
                </p>
                <p className="text-lg font-semibold">
                  <span
                    className={`badge ${
                      booking.status === "confirmed"
                        ? "badge-success"
                        : booking.status === "pending"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
              {customer && (
                <>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      Customer Phone
                    </p>
                    <p className="text-lg font-semibold">{customer.phno}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      Customer Email
                    </p>
                    <p className="text-lg font-semibold">{customer.gmail}</p>
                  </div>
                </>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="status">
                <span className="label-text">Update Status</span>
              </label>
              <select
                id="status"
                className="select select-bordered w-full max-w-xs"
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
  );
};

export default ViewBooking;
