/** @format */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import apiUrl from "../utils/api.js";
import { Link } from "react-router-dom";
import { FaInbox, FaPaperPlane, FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaBox, FaHome } from "react-icons/fa";
import GuideIncomingRequests from "../components/GuideIncomingRequests";
import ConfirmationModal from "../components/ConfirmationModal";

const GuideRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("incoming");
  const [incomingCount, setIncomingCount] = useState(0);

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
        const response = await axios.get(`${apiUrl}/guide-requests`, {
          params: { guideId, initiator: "guide" },
          headers: { Authorization: `Bearer ${token}` },
        });
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
    setModalData({
      title: "Cancel Request",
      message: "Are you sure you want to cancel this request?",
      onConfirm: async () => {
        try {
          const loadingToastId = toast.loading("Cancelling request...");
          await axios.delete(`${apiUrl}/guide-requests/${requestId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRequests((prevRequests) =>
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
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <ToastContainer />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalData.onConfirm}
        title={modalData.title}
        message={modalData.message}
      />

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            006 / Request Hub
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            Guide Requests
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Manage incoming and outgoing guide requests. Stay on top of your
            assignments and collaborations.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="border border-[#111111]/10 mb-8">
          <div className="flex">
            <button
              onClick={() => setActiveSection("incoming")}
              className={`flex items-center gap-3 px-6 md:px-8 py-5 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex-1 justify-center ${
                activeSection === "incoming"
                  ? "bg-[#111111] text-[#f5f3f0]"
                  : "text-[#111111]/50 hover:text-[#111111] hover:bg-[#ffffff]"
              }`}
            >
              <FaInbox className="text-sm" />
              Incoming
              {incomingCount > 0 && (
                <span className="ml-2 bg-[#f5f3f0] text-[#111111] text-[9px] px-2 py-0.5 font-bold">
                  {incomingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection("sent")}
              className={`flex items-center gap-3 px-6 md:px-8 py-5 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex-1 justify-center ${
                activeSection === "sent"
                  ? "bg-[#111111] text-[#f5f3f0]"
                  : "text-[#111111]/50 hover:text-[#111111] hover:bg-[#ffffff]"
              }`}
            >
              <FaPaperPlane className="text-sm" />
              Sent
            </button>
          </div>
        </div>

        {/* Incoming */}
        {activeSection === "incoming" && (
          <GuideIncomingRequests
            guideId={guideId}
            token={token}
            setIncomingCount={setIncomingCount}
          />
        )}

        {/* Sent */}
        {activeSection === "sent" && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
                  <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
                </div>
                <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
                  Loading Requests...
                </p>
              </div>
            ) : error ? (
              <div className="border border-red-500/30 p-6 md:p-8 text-red-600 text-[10px] uppercase tracking-widest">
                {error}
              </div>
            ) : requests.length === 0 ? (
              <div className="border border-[#111111]/10 p-8 md:p-16 text-center">
                <FaBox className="w-16 h-16 text-[#111111]/20 mx-auto mb-6" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
                  No Sent Requests
                </h2>
                <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-6">
                  You have not requested to guide any packages yet.
                </p>
                <Link
                  to="/home"
                  className="inline-block bg-[#111111] text-[#f5f3f0] px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                >
                  Browse Packages
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {requests.map((request, index) => (
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
                            {request.packageName || "PACKAGE REQUEST"}
                          </h3>
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
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}:{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cancel Button */}
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          className="w-full bg-red-500/10 text-red-600 border border-red-500/30 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors duration-300"
                        >
                          Cancel Request
                        </button>
                      )}
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
