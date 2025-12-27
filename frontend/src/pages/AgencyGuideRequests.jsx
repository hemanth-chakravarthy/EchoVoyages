/** @format */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import {
  FaInbox,
  FaPaperPlane,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaUserTie,
  FaCalendarAlt,
  FaCommentAlt,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

const AgencyGuideRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [activeSection, setActiveSection] = useState("incoming");

  const token = localStorage.getItem("token");
  const agencyId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token || !agencyId) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        // Fetch incoming requests (guide to agency)
        const incomingResponse = await axios.get(`${apiUrl}/guide-requests`, {
          params: {
            agencyId,
            initiator: "guide", // Requests initiated by guides
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch outgoing requests (agency to guide)
        const outgoingResponse = await axios.get(`${apiUrl}/guide-requests`, {
          params: {
            agencyId,
            initiator: "agency", // Requests initiated by this agency
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIncomingRequests(incomingResponse.data.data || []);
        setOutgoingRequests(outgoingResponse.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching guide requests:", err);
        setError("Failed to load guide requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, agencyId]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.put(
        `${apiUrl}/guide-requests/${requestId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state for incoming requests
      setIncomingRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );
      toast.success(`Request ${newStatus} successfully`);
    } catch (err) {
      console.error(`Error ${newStatus} guide request:`, err);
      toast.error(`Failed to ${newStatus} request`);
    }
  };

  const handleCancelRequest = async (requestId, guideName) => {
    // Show confirmation dialog
    if (
      !window.confirm(
        `Are you sure you want to cancel your request to ${guideName}?`
      )
    ) {
      return; // User cancelled the operation
    }

    try {
      // Show loading toast
      const loadingToastId = toast.loading("Cancelling request...");

      // Delete the request from the database
      await axios.delete(`${apiUrl}/guide-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the request from the local state
      setOutgoingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      // Update loading toast to success
      toast.update(loadingToastId, {
        render: "Request cancelled successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error cancelling guide request:", err);
      toast.error(
        "Failed to cancel request: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Get the appropriate requests based on active section
  const requests =
    activeSection === "incoming" ? incomingRequests : outgoingRequests;

  // Filter requests based on active tab (only for incoming requests)
  const filteredRequests =
    activeSection === "incoming"
      ? requests.filter((request) => request.status === activeTab)
      : requests;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a66c2] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading guide requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaInbox className="text-[#0a66c2] text-2xl" />
            <h1 className="text-3xl font-bold text-[#0a66c2]">
              Guide Requests
            </h1>
          </div>
          <p className="text-gray-600 ml-9">
            Manage your incoming and outgoing guide requests
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2">
            <FaTimesCircle className="text-red-500" />
            {error}
          </div>
        ) : (
          <>
            {/* Section Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="flex border-b">
                <button
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-base transition-colors duration-200 ${
                    activeSection === "incoming"
                      ? "border-b-2 border-[#0a66c2] text-[#0a66c2] bg-blue-50/50"
                      : "text-gray-600 hover:text-[#0a66c2] hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSection("incoming")}
                >
                  <FaInbox />
                  Incoming Requests
                  {incomingRequests.filter((r) => r.status === "pending")
                    .length > 0 && (
                    <span className="ml-2 bg-[#0a66c2] text-white text-xs px-2 py-0.5 rounded-full">
                      {
                        incomingRequests.filter((r) => r.status === "pending")
                          .length
                      }
                    </span>
                  )}
                </button>
                <button
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-base transition-colors duration-200 ${
                    activeSection === "outgoing"
                      ? "border-b-2 border-[#0a66c2] text-[#0a66c2] bg-blue-50/50"
                      : "text-gray-600 hover:text-[#0a66c2] hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSection("outgoing")}
                >
                  <FaPaperPlane />
                  Sent Requests
                  {outgoingRequests.length > 0 && (
                    <span className="ml-2 bg-[#0a66c2] text-white text-xs px-2 py-0.5 rounded-full">
                      {outgoingRequests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Status Tabs */}
              {activeSection === "incoming" && (
                <div className="flex px-6 py-2 border-b bg-gray-50">
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200 ${
                        activeTab === status
                          ? "bg-white text-[#0a66c2] shadow-sm border border-gray-200"
                          : "text-gray-600 hover:bg-white hover:text-[#0a66c2]"
                      }`}
                      onClick={() => setActiveTab(status)}
                    >
                      {status === "pending" && <FaClock />}
                      {status === "approved" && <FaCheckCircle />}
                      {status === "rejected" && <FaTimesCircle />}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Requests
                </h2>
                <p className="text-gray-600">
                  {activeSection === "incoming"
                    ? activeTab === "pending"
                      ? "You don't have any pending guide requests."
                      : activeTab === "approved"
                        ? "You haven't approved any guide requests yet."
                        : "You haven't rejected any guide requests yet."
                    : "You haven't sent any requests to guides yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#0a66c2] mb-1">
                            {request.packageName || "Package"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaUserTie />
                            <span>{request.guideName || "Unknown Guide"}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                            request.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : request.status === "approved"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {request.status === "pending" && <FaClock />}
                          {request.status === "approved" && <FaCheckCircle />}
                          {request.status === "rejected" && <FaTimesCircle />}
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </div>

                      {request.message && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-start gap-2">
                          <FaCommentAlt className="text-gray-400 mt-1" />
                          <p className="text-sm text-gray-700">
                            {request.message}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-600 mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#0a66c2]" />
                          <span>
                            Requested on:{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {request.status !== "pending" && (
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#0a66c2]" />
                            <span>
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}{" "}
                              on:{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center">
                        {request.packageId && (
                          <Link
                            to={`/packages/${
                              typeof request.packageId === "object" &&
                              request.packageId !== null
                                ? request.packageId._id
                                : request.packageId
                            }`}
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-3 py-1 bg-[#0a66c2] text-white text-sm rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                            >
                              View Package
                            </motion.button>
                          </Link>
                        )}

                        {/* Only show approve/reject buttons for incoming requests that are pending */}
                        {activeSection === "incoming" &&
                          request.status === "pending" && (
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  handleStatusUpdate(request._id, "approved")
                                }
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-300"
                              >
                                Approve
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  handleStatusUpdate(request._id, "rejected")
                                }
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-300"
                              >
                                Reject
                              </motion.button>
                            </div>
                          )}

                        {/* For outgoing requests */}
                        {activeSection === "outgoing" && (
                          <div className="flex items-center space-x-3">
                            {/* Status indicator */}
                            {/* <div className={`px-3 py-1 text-sm rounded-md font-medium ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div> */}

                            {/* Cancel button for pending requests */}
                            {request.status === "pending" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleCancelRequest(
                                    request._id,
                                    request.guideName || "this guide"
                                  )
                                }
                                className="px-4 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                              >
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> */}
                                {/* </svg> */}
                                Cancel Request
                              </motion.button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AgencyGuideRequests;
