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
        const incomingResponse = await axios.get(`${apiUrl}/guide-requests`, {
          params: {
            agencyId,
            initiator: "guide",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const outgoingResponse = await axios.get(`${apiUrl}/guide-requests`, {
          params: {
            agencyId,
            initiator: "agency",
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
    if (
      !window.confirm(
        `Are you sure you want to cancel your request to ${guideName}?`
      )
    ) {
      return;
    }

    try {
      const loadingToastId = toast.loading("Cancelling request...");

      await axios.delete(`${apiUrl}/guide-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOutgoingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

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

  const requests =
    activeSection === "incoming" ? incomingRequests : outgoingRequests;

  const filteredRequests =
    activeSection === "incoming"
      ? requests.filter((request) => request.status === activeTab)
      : requests;

  const pendingIncomingCount = incomingRequests.filter(
    (r) => r.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
          </div>
          <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
            Loading Requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            002 / Requests
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            Guide Requests
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Manage your incoming and outgoing guide requests. Stay connected and
            coordinate your next voyage.
          </p>
        </div>

        {error ? (
          <div className="border border-red-500/30 p-6 md:p-8 text-red-600 text-[10px] uppercase tracking-widest">
            {error}
          </div>
        ) : (
          <>
            {/* Section Tabs */}
            <div className="border border-[#111111]/10 mb-8">
              <div className="flex border-b border-[#111111]/10">
                <button
                  className={`flex items-center gap-3 px-6 md:px-8 py-5 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    activeSection === "incoming"
                      ? "bg-[#111111] text-[#f5f3f0]"
                      : "text-[#111111]/50 hover:text-[#111111] hover:bg-[#ffffff]"
                  }`}
                  onClick={() => setActiveSection("incoming")}
                >
                  <FaInbox className="text-sm" />
                  Incoming
                  {pendingIncomingCount > 0 && (
                    <span className="ml-2 bg-[#f5f3f0] text-[#111111] text-[9px] px-2 py-0.5 font-bold">
                      {pendingIncomingCount}
                    </span>
                  )}
                </button>
                <button
                  className={`flex items-center gap-3 px-6 md:px-8 py-5 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    activeSection === "outgoing"
                      ? "bg-[#111111] text-[#f5f3f0]"
                      : "text-[#111111]/50 hover:text-[#111111] hover:bg-[#ffffff]"
                  }`}
                  onClick={() => setActiveSection("outgoing")}
                >
                  <FaPaperPlane className="text-sm" />
                  Sent
                  {outgoingRequests.length > 0 && (
                    <span className="ml-2 bg-[#f5f3f0] text-[#111111] text-[9px] px-2 py-0.5 font-bold">
                      {outgoingRequests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Status Tabs */}
              {activeSection === "incoming" && (
                <div className="flex px-6 md:px-8 py-3 bg-[#f0eeeb] gap-2">
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      className={`flex items-center gap-2 px-4 py-2 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                        activeTab === status
                          ? "text-[#111111] border-b-2 border-[#111111]"
                          : "text-[#111111]/40 hover:text-[#111111]/70"
                      }`}
                      onClick={() => setActiveTab(status)}
                    >
                      {status === "pending" && <FaClock className="text-xs" />}
                      {status === "approved" && (
                        <FaCheckCircle className="text-xs" />
                      )}
                      {status === "rejected" && (
                        <FaTimesCircle className="text-xs" />
                      )}
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase">
                {filteredRequests.length} REQUEST
                {filteredRequests.length !== 1 ? "S" : ""}
              </span>
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 ? (
              <div className="border border-[#111111]/10 p-8 md:p-16 text-center">
                <FaBox className="w-16 h-16 text-[#111111]/20 mx-auto mb-6" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
                  No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Requests
                </h2>
                <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group border border-[#111111]/10 bg-[#ffffff] hover:border-[#111111]/30 transition-all duration-500"
                  >
                    <div className="p-6 md:p-8">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111] mb-2">
                            {request.packageName || "PACKAGE"}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-[#111111]/50 uppercase tracking-widest">
                            <FaUserTie className="text-xs" />
                            <span>{request.guideName || "Unknown Guide"}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                            request.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30"
                              : request.status === "approved"
                              ? "bg-green-500/10 text-green-600 border border-green-500/30"
                              : "bg-red-500/10 text-red-600 border border-red-500/30"
                          }`}
                        >
                          {request.status === "pending" && (
                            <FaClock className="text-xs" />
                          )}
                          {request.status === "approved" && (
                            <FaCheckCircle className="text-xs" />
                          )}
                          {request.status === "rejected" && (
                            <FaTimesCircle className="text-xs" />
                          )}
                          {request.status}
                        </span>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="bg-[#f0eeeb] p-4 mb-6 flex items-start gap-3 border border-[#111111]/5">
                          <FaCommentAlt className="text-[#111111]/30 mt-1" />
                          <p className="text-[10px] text-[#111111]/70 uppercase tracking-widest leading-relaxed">
                            {request.message}
                          </p>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-6 space-y-2">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#111111]/30" />
                          <span>
                            Requested:{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {request.status !== "pending" && (
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#111111]/30" />
                            <span>
                              {request.status}:{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center gap-3">
                        {request.packageId && (
                          <Link
                            to={`/packages/${
                              typeof request.packageId === "object" &&
                              request.packageId !== null
                                ? request.packageId._id
                                : request.packageId
                            }`}
                            className="flex-1"
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                            >
                              View Package
                            </motion.button>
                          </Link>
                        )}

                        {activeSection === "incoming" &&
                          request.status === "pending" && (
                            <div className="flex gap-2 flex-1">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  handleStatusUpdate(request._id, "approved")
                                }
                                className="flex-1 bg-green-500/10 text-green-600 border border-green-500/30 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500/20 transition-colors duration-300"
                              >
                                Approve
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  handleStatusUpdate(request._id, "rejected")
                                }
                                className="flex-1 bg-red-500/10 text-red-600 border border-red-500/30 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors duration-300"
                              >
                                Reject
                              </motion.button>
                            </div>
                          )}

                        {activeSection === "outgoing" &&
                          request.status === "pending" && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                handleCancelRequest(
                                  request._id,
                                  request.guideName || "this guide"
                                )
                              }
                              className="flex-1 bg-red-500/10 text-red-600 border border-red-500/30 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors duration-300"
                            >
                              Cancel Request
                            </motion.button>
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
