/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import GuideIncomingRequests from "../components/guideincomingrequests";
import ConfirmationModal from "../components/ConfirmationModal";

const GuideRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("incoming");
  const [incomingCount, setIncomingCount] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const token = localStorage.getItem("token");
  const guideId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token || !guideId) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5000/guide-requests",
          {
            params: { guideId, initiator: "guide" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching guide requests:", err);
        setError("Failed to load your guide requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token, guideId]);

  const handleCancelRequest = (requestId) => {
    // Open confirmation modal
    setModalData({
      title: "Cancel Request",
      message: "Are you sure you want to cancel this request?",
      onConfirm: async () => {
        try {
          // Show loading toast
          const loadingToastId = toast.loading("Cancelling request...");
          await axios.delete(`http://localhost:5000/guide-requests/${requestId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Remove the request from the list
          setRequests((prevRequests) =>
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
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans bg-[#f3f6f8]">
      <ToastContainer />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalData.onConfirm}
        title={modalData.title}
        message={modalData.message}
      />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-[#0a66c2] mb-6">
          Guide Requests
        </h1>

        {/* Section Toggle Buttons */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setActiveSection("incoming")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeSection === "incoming"
                ? "bg-[#0a66c2] text-white"
                : "bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#f3f6f8]"
            }`}
          >
            Incoming Requests
            {incomingCount > 0 && (
              <span className="ml-2 bg-white text-[#0a66c2] rounded-full px-2 py-0.5 text-xs font-bold">
                {incomingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection("sent")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeSection === "sent"
                ? "bg-[#0a66c2] text-white"
                : "bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#f3f6f8]"
            }`}
          >
            Sent Requests
          </button>
        </div>

        {activeSection === "incoming" && (
          <div>
            <GuideIncomingRequests
              guideId={guideId}
              token={token}
              setIncomingCount={setIncomingCount}
            />
          </div>
        )}

        {activeSection === "sent" && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white bg-opacity-90 rounded-lg shadow-md">
                <svg
                  className="animate-spin h-10 w-10 text-[#0a66c2] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-[#38434f] text-lg">
                  Loading your guide requests...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">{error}</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white bg-opacity-95 rounded-lg shadow-md p-8 text-center">
                <svg
                  className="h-16 w-16 text-[#0a66c2] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-[#38434f] text-lg mb-4">
                  You haven't requested to guide any packages yet.
                </p>
                <Link
                  to="/home"
                  className="inline-block bg-[#0a66c2] hover:bg-[#004182] text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Browse Packages
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white bg-opacity-95 rounded-lg shadow-md p-6 border border-[#dce6f1]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0a66c2] mb-2">
                          {request.packageName || "Package Request"}
                        </h3>
                        <p className="text-[#38434f] mb-3">{request.message}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-[#38434f]">
                          <span className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1 text-[#0a66c2]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <span className="font-medium mr-1">
                              Requested on:
                            </span>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>

                          {request.status !== "pending" && (
                            <span className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-1 text-[#0a66c2]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                ></path>
                              </svg>
                              <span className="font-medium mr-1">
                                {request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1)}{" "}
                                on:
                              </span>{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status}
                        </span>

                        {request.status === "pending" && (
                          <button
                            onClick={() => handleCancelRequest(request._id)}
                            className="mt-3 bg-[#0a66c2] hover:bg-[#004182] text-white py-2 px-4 rounded-md font-medium transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default GuideRequests;
