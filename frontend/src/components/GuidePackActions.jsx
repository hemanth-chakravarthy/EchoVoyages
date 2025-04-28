import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import axios from "axios";

const GuidePackActions = () => {
  const { id: packageId } = useParams();
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [message, setMessage] = useState("");
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  const token = localStorage.getItem("token");
  const guideId = token ? jwtDecode(token).id : null;

  // Fetch package details and check for existing requests
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId || !token) {
        console.log("Missing packageId or token:", { packageId, token: !!token });
        return;
      }

      console.log("GuidePackActions: Fetching package details for packageId:", packageId);
      console.log("GuidePackActions: Guide ID:", guideId);

      setLoading(true);
      try {
        // Fetch package details
        const packageResponse = await axios.get(
          `http://localhost:5000/packages/${packageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("GuidePackActions: Package details:", packageResponse.data);
        setPackageDetails(packageResponse.data);

        // Check if guide is already assigned to this package
        const isAssigned = packageResponse.data.guides?.some(
          (g) => g._id === guideId || g === guideId
        );

        console.log("GuidePackActions: Is guide assigned:", isAssigned);

        if (isAssigned) {
          toast.info("You are already assigned to this package");
          return;
        }

        // Check for existing requests
        const requestsResponse = await axios.get(
          "http://localhost:5000/guide-requests",
          {
            params: {
              guideId,
              packageId,
              type: "package_assignment",
              initiator: "guide",
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("GuidePackActions: Existing requests:", requestsResponse.data);

        if (requestsResponse.data.data && requestsResponse.data.data.length > 0) {
          console.log("GuidePackActions: Found existing request");
          setExistingRequest(requestsResponse.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load package information");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId, guideId, token]);

  const handleSendRequest = async () => {
    if (!guideId || !packageId) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/guide-requests/guide-to-package",
        {
          guideId,
          packageId,
          message: message || "I'm interested in guiding this package",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Request sent successfully!");
        setShowRequestModal(false);
        setExistingRequest(response.data.data);
        // Optionally navigate to guide requests page
        // navigate("/guide-requests");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      const errorMessage = error.response?.data?.message || "Failed to send request";
      toast.error(errorMessage);
    }
  };

  const handleCancelRequest = async () => {
    if (!existingRequest?._id) {
      toast.error("No request to cancel");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/guide-requests/${existingRequest._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Request cancelled successfully");
      setExistingRequest(null);
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Failed to cancel request");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.main
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <div className="flex justify-center gap-6 mb-8">
          {!existingRequest ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequestModal(true)}
              className="bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
            >
              Send Guide Request
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                existingRequest.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : existingRequest.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Request Status: {existingRequest.status.charAt(0).toUpperCase() + existingRequest.status.slice(1)}
              </div>

              {existingRequest.status === 'pending' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelRequest}
                  className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300 shadow-md"
                >
                  Cancel Request
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Modal for sending request */}
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md"
            >
              <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">
                Send Guide Request
              </h2>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="text-black font-medium">Message to Agency:</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain why you're interested in guiding this package..."
                  className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300 resize-none"
                  rows="4"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendRequest}
                  className="bg-[#00072D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                >
                  Send Request
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRequestModal(false)}
                  className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-all duration-300 shadow-md"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
};

export default GuidePackActions;
