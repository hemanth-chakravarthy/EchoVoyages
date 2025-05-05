/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import apiUrl from "../utils/api.js";

const GuideRequestsList = ({ packageId, refreshTrigger = 0 }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const agencyId = token ? jwtDecode(token).id : null;

  // Fetch guide requests for this package
  useEffect(() => {
    const fetchRequests = async () => {
      if (!token || !agencyId) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const params = packageId
          ? {
              packageId,
              agencyId,
              type: "package_assignment",
              initiator: "guide",
            }
          : { agencyId, initiator: "guide" };

        const response = await axios.get("${apiUrl}/guide-requests", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching guide requests:", err);
        setError("Failed to load guide requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, agencyId, packageId, refreshTrigger]);

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

      // Update the local state
      setRequests((prevRequests) =>
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

  if (loading) {
    return <div className="text-center py-4">Loading guide requests...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          No guide requests found for this package.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="text-xl font-bold text-[#1a365d] mb-4">
        Guide Requests {packageId ? "for this Package" : ""}
      </h3>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-lg">
                  {request.guideName || "Guide"}
                </h4>
                <p className="text-sm text-gray-600">
                  Package: {request.packageName || "Unknown Package"}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>
            </div>

            {request.message && (
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <p className="text-sm text-gray-700">{request.message}</p>
              </div>
            )}

            <p className="text-xs text-gray-500 mb-3">
              Requested on: {new Date(request.createdAt).toLocaleDateString()}
            </p>

            {request.status === "pending" && (
              <div className="flex space-x-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate(request._id, "approved")}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate(request._id, "rejected")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-300"
                >
                  Reject
                </motion.button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideRequestsList;
