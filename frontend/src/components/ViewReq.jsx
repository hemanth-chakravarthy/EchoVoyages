/** @format */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import apiUrl from "../utils/api.js";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

const ViewReq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!id) {
      alert("Invalid request ID.");
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/requests/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.data) {
          setRequestDetails(data.data);
          setStatus(data.data.status);
        } else {
          alert("Request not found!");
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        alert("Error fetching request details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: requestDetails._id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setStatus(newStatus);
        if (newStatus === "approved") {
          // First check if there's an existing booking for this request
          const bookingUpdated = await updateExistingBooking("confirmed");
          // If no existing booking was found, create a new one
          if (!bookingUpdated) {
            await addRequestToBookings("confirmed");
          }
          setModalMessage(
            "Request approved and booking status updated to confirmed."
          );
        } else if (newStatus === "rejected") {
          // Update any existing booking to canceled status
          const bookingUpdated = await updateExistingBooking("canceled");
          if (bookingUpdated) {
            setModalMessage(
              "Request rejected and booking status updated to canceled."
            );
          } else {
            setModalMessage("Request rejected. No associated booking found.");
          }
        } else {
          setModalMessage("Status updated successfully.");
        }
        setShowModal(true);
      } else {
        const errorData = await response.json();
        setModalMessage(`Failed to update status: ${errorData.message}`);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setModalMessage("An error occurred while updating the status.");
      setShowModal(true);
    }
  };

  // Function to update existing booking if one exists
  const updateExistingBooking = async (newStatus = "confirmed") => {
    try {
      // Check if there's an existing booking for this customer and package
      const response = await fetch(
        `${apiUrl}/bookings/cust/${requestDetails.customerId}`
      );
      if (response.ok) {
        const bookings = await response.json();
        // Find a booking that matches this package
        const matchingBooking = bookings.find(
          (booking) =>
            booking.packageId === requestDetails.packageId &&
            (booking.status === "pending" || booking.status === "confirmed")
        );

        if (matchingBooking) {
          // Update the existing booking to the new status
          const updateResponse = await fetch(
            `${apiUrl}/bookings/${matchingBooking._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: newStatus,
                totalPrice: requestDetails.price, // Update price if it changed in the request
              }),
            }
          );

          if (updateResponse.ok) {
            console.log(`Existing booking updated to ${newStatus} status`);
            return true; // Return true to indicate a booking was updated
          }
        }
      }
      return false; // Return false if no booking was updated
    } catch (error) {
      console.error("Error updating existing booking:", error);
      return false;
    }
  };

  const addRequestToBookings = async (status = "confirmed") => {
    try {
      // Check if a booking already exists for this customer and package
      const checkResponse = await fetch(
        `${apiUrl}/bookings/cust/${requestDetails.customerId}`
      );
      if (checkResponse.ok) {
        const existingBookings = await checkResponse.json();
        // Check if there's already a booking for this package
        const existingBooking = existingBookings.find(
          (booking) => booking.packageId === requestDetails.packageId
        );

        if (existingBooking) {
          // If a booking already exists, update its status
          const updateResponse = await fetch(
            `${apiUrl}/bookings/${existingBooking._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: status,
                totalPrice: requestDetails.price, // Update price if it changed in the request
              }),
            }
          );

          if (updateResponse.ok) {
            console.log(`Existing booking updated to ${status} status`);
            setModalMessage(`Existing booking updated to ${status} status.`);
            setShowModal(true);
          } else {
            console.error(
              `Failed to update existing booking status to ${status}`
            );
          }
          return;
        }
      }

      // If no booking exists and status is confirmed, create a new one
      if (status === "confirmed") {
        const response = await fetch(`${apiUrl}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: requestDetails.customerName,
            customerId: requestDetails.customerId,
            packageName: requestDetails.packageName,
            packageId: requestDetails.packageId,
            guideName: requestDetails.guideName || "",
            guideId: requestDetails.guideId || null,
            totalPrice: requestDetails.price,
            status: status, // Set status as specified
          }),
        });

        if (response.ok) {
          setModalMessage(
            `Request successfully added to bookings with ${status} status.`
          );
          setShowModal(true);
        } else {
          const errorData = await response.json();
          setModalMessage(`Failed to add to bookings: ${errorData.message}`);
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error adding to bookings:", error);
      setModalMessage("An error occurred while adding to bookings.");
      setShowModal(true);
    }
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return <FaSpinner className="text-[#FFC107] animate-spin" />;
      case "approved":
        return <FaCheckCircle className="text-[#4CAF50]" />;
      case "rejected":
        return <FaTimesCircle className="text-[#F44336]" />;
      default:
        return <FaInfoCircle className="text-black/40" />;
    }
  };

  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "bg-[#FFC107] text-[#1a1a1a]";
      case "approved":
        return "bg-[#4CAF50] text-white";
      case "rejected":
        return "bg-[#F44336] text-white";
      default:
        return "bg-black/10 text-black/60";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#F44336] flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-4xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Request Not Found</h2>
          <p className="text-sm text-black/60 mb-8">
            The request you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/AgentHome"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d2d2d] transition-all"
          >
            <FaArrowLeft /> Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-12 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <Link
          to="/AgentHome"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/60 hover:text-[#1a1a1a] transition-colors mb-8"
        >
          <FaArrowLeft /> Back to All Requests
        </Link>

        <span className="block text-xs font-bold tracking-[0.3em] text-black/40 uppercase mb-4">
          001 / Request Management
        </span>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">
            Request Details
          </h1>
          <div className={`px-6 py-3 ${getStatusClass(status)} flex items-center gap-3`}>
            {getStatusIcon(status)}
            <span className="text-xs font-bold uppercase tracking-widest">{status}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-black/5">
          {/* Customer & Package Information */}
          <div className="p-8 md:p-12 border-b border-black/5">
            <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-8">
              002 / Information
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="text-[#1a1a1a]" />
                  <h2 className="text-xl font-bold text-[#1a1a1a]">Customer Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#1a1a1a] pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      Name
                    </span>
                    <span className="block text-lg font-bold text-[#1a1a1a]">
                      {requestDetails.customerName}
                    </span>
                  </div>
                  <div className="border-l-4 border-[#1a1a1a] pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      Customer ID
                    </span>
                    <span className="block text-sm font-semibold text-black/70">
                      {requestDetails.customerId}
                    </span>
                  </div>
                  <div className="border-l-4 border-[#1a1a1a] pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      Request Date
                    </span>
                    <span className="block text-sm font-semibold text-black/70">
                      {new Date(requestDetails.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaMapMarkerAlt className="text-[#1a1a1a]" />
                  <h2 className="text-xl font-bold text-[#1a1a1a]">Package Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#1a1a1a] pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      Package Name
                    </span>
                    <span className="block text-lg font-bold text-[#1a1a1a]">
                      {requestDetails.packageName}
                    </span>
                  </div>
                  <div className="border-l-4 border-[#1a1a1a] pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      Package ID
                    </span>
                    <span className="block text-sm font-semibold text-black/70">
                      {requestDetails.packageId}
                    </span>
                  </div>
                  <div className="border-l-4 border-[#1a1a1a] pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      Price
                    </span>
                    <span className="block text-2xl font-bold text-[#1a1a1a]">
                      Rs. {requestDetails.price?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {requestDetails.additionalDetails && Object.keys(requestDetails.additionalDetails).length > 0 && (
            <div className="p-8 md:p-12 border-b border-black/5">
              <div className="flex items-center gap-3 mb-6">
                <FaInfoCircle className="text-[#1a1a1a]" />
                <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">
                  003 / Additional Details
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(requestDetails.additionalDetails).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-black/20 pl-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-2">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="block text-sm font-semibold text-black/70">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Management */}
          <div className="p-8 md:p-12">
            <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-6">
              004 / Manage Status
            </span>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleStatusChange("approved")}
                disabled={status === "approved"}
                className={`flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  status === "approved"
                    ? "bg-[#4CAF50]/20 text-[#4CAF50] cursor-not-allowed"
                    : "bg-[#4CAF50] text-white hover:bg-[#45a049]"
                }`}
              >
                <FaCheckCircle /> Approve Request
              </button>
              <button
                onClick={() => handleStatusChange("rejected")}
                disabled={status === "rejected"}
                className={`flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  status === "rejected"
                    ? "bg-[#F44336]/20 text-[#F44336] cursor-not-allowed"
                    : "bg-[#F44336] text-white hover:bg-[#da190b]"
                }`}
              >
                <FaTimesCircle /> Reject Request
              </button>
              <button
                onClick={() => handleStatusChange("pending")}
                disabled={status === "pending"}
                className={`flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  status === "pending"
                    ? "bg-[#FFC107]/20 text-[#FFC107] cursor-not-allowed"
                    : "bg-[#FFC107] text-[#1a1a1a] hover:bg-[#ffb300]"
                }`}
              >
                <FaSpinner /> Mark as Pending
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full border border-black/5"
          >
            <div className="p-8 md:p-12 text-center">
              {status === "approved" ? (
                <div className="w-20 h-20 bg-[#4CAF50] flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
              ) : status === "rejected" ? (
                <div className="w-20 h-20 bg-[#F44336] flex items-center justify-center mx-auto mb-6">
                  <FaTimesCircle className="text-4xl text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
                  <FaInfoCircle className="text-4xl text-white" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Status Updated</h3>
              <p className="text-sm text-black/60 mb-8">{modalMessage}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate("/AgentHome")}
                  className="px-6 py-3 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-all"
                >
                  View All Requests
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default ViewReq;
