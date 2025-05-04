/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaInfoCircle,
  FaArrowLeft,
  FaClipboardCheck,
  FaClipboardList,
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
        const response = await fetch(`http://localhost:5000/requests/${id}`);
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
      const response = await fetch(`http://localhost:5000/requests/${id}`, {
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
        `http://localhost:5000/bookings/cust/${requestDetails.customerId}`
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
            `http://localhost:5000/bookings/${matchingBooking._id}`,
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
        `http://localhost:5000/bookings/cust/${requestDetails.customerId}`
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
            `http://localhost:5000/bookings/${existingBooking._id}`,
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
        const response = await fetch("http://localhost:5000/bookings", {
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
        return <FaSpinner className="text-[#e7a33e] animate-spin" />;
      case "approved":
        return <FaCheckCircle className="text-[#44712e]" />;
      case "rejected":
        return <FaTimesCircle className="text-[#b24020]" />;
      default:
        return <FaInfoCircle className="text-[#56687a]" />;
    }
  };

  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "bg-[#f5efd9] text-[#e7a33e]";
      case "approved":
        return "bg-[#eaf5ea] text-[#44712e]";
      case "rejected":
        return "bg-[#f5e9e5] text-[#b24020]";
      default:
        return "bg-[#f3f6f8] text-[#56687a]";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] flex items-center justify-center font-['Source Sans', 'Segoe UI', Arial, sans-serif]">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#38434f] font-medium">
              Loading request details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] flex items-center justify-center font-['Source Sans', 'Segoe UI', Arial, sans-serif]">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
          <FaExclamationTriangle className="text-[#b24020] text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#38434f] mb-2">
            Request Not Found
          </h2>
          <p className="text-[#56687a] mb-6">
            The request you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/AgentHome"
            className="inline-flex items-center bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] py-8 px-4 font-['Source Sans', 'Segoe UI', Arial, sans-serif]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/AgentHome"
            className="inline-flex items-center text-[#0a66c2] hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to All Requests
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0a66c2] to-[#004182] p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Request Details</h1>
                <p className="text-[#dce6f1]">
                  Review and manage customer request
                </p>
              </div>
              <div
                className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${getStatusClass(status)} flex items-center`}
              >
                {getStatusIcon(status)}
                <span className="ml-2 font-medium capitalize">{status}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-[#38434f] mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#0a66c2]" /> Customer
                  Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[#56687a] text-sm">Name</span>
                    <span className="text-[#38434f] font-medium">
                      {requestDetails.customerName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#56687a] text-sm">Customer ID</span>
                    <span className="text-[#38434f] font-medium">
                      {requestDetails.customerId}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#56687a] text-sm">Request Date</span>
                    <span className="text-[#38434f] font-medium">
                      {new Date(requestDetails.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-[#f3f6f8] p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-[#38434f] mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#0a66c2]" /> Package
                  Information
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[#56687a] text-sm">Package Name</span>
                    <span className="text-[#38434f] font-medium">
                      {requestDetails.packageName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#56687a] text-sm">Package ID</span>
                    <span className="text-[#38434f] font-medium">
                      {requestDetails.packageId}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#56687a] text-sm">Price</span>
                    <span className="text-[#38434f] font-medium flex items-center">
                      Rs. {requestDetails.price?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-6 bg-[#f3f6f8] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-[#38434f] mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-[#0a66c2]" /> Additional
                Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requestDetails.additionalDetails &&
                  Object.entries(requestDetails.additionalDetails).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[#56687a] text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-[#38434f] font-medium">
                          {value}
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Status Management */}
            <div className="mt-6 border-t border-[#e9e5df] pt-6">
              <h2 className="text-lg font-semibold text-[#38434f] mb-4">
                Manage Request Status
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange("approved")}
                  disabled={status === "approved"}
                  className={`flex items-center px-4 py-2 rounded ${
                    status === "approved"
                      ? "bg-[#eaf5ea] text-[#44712e] cursor-not-allowed"
                      : "bg-[#44712e] text-white hover:bg-[#365d25] transition-colors"
                  }`}
                >
                  <FaCheckCircle className="mr-2" /> Approve Request
                </button>
                <button
                  onClick={() => handleStatusChange("rejected")}
                  disabled={status === "rejected"}
                  className={`flex items-center px-4 py-2 rounded ${
                    status === "rejected"
                      ? "bg-[#f5e9e5] text-[#b24020] cursor-not-allowed"
                      : "bg-[#b24020] text-white hover:bg-[#8e331a] transition-colors"
                  }`}
                >
                  <FaTimesCircle className="mr-2" /> Reject Request
                </button>
                <button
                  onClick={() => handleStatusChange("pending")}
                  disabled={status === "pending"}
                  className={`flex items-center px-4 py-2 rounded ${
                    status === "pending"
                      ? "bg-[#f5efd9] text-[#e7a33e] cursor-not-allowed"
                      : "bg-[#e7a33e] text-white hover:bg-[#c98b33] transition-colors"
                  }`}
                >
                  <FaSpinner className="mr-2" /> Mark as Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <div className="text-center">
              {status === "approved" ? (
                <FaCheckCircle className="text-[#44712e] text-5xl mx-auto mb-4" />
              ) : status === "rejected" ? (
                <FaTimesCircle className="text-[#b24020] text-5xl mx-auto mb-4" />
              ) : (
                <FaInfoCircle className="text-[#0a66c2] text-5xl mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold text-[#38434f] mb-2">
                Status Updated
              </h3>
              <p className="text-[#56687a] mb-6">{modalMessage}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate("/AgentHome")}
                  className="px-4 py-2 bg-[#f3f6f8] text-[#0a66c2] rounded hover:bg-[#dce6f1] transition-colors"
                >
                  View All Requests
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewReq;
