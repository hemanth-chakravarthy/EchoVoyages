/** @format */

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import apiUrl from "../utils/api.js";

const AgencyPayments = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const agencyId = jwtDecode(localStorage.getItem("token")).id;

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        // Fetch all guides
        const response = await axios.get(`${apiUrl}/guides`);

        // Filter guides that have packages from this agency
        const guidesData = response.data.data || [];

        // Get agency's packages
        const packagesResponse = await axios.get(
          `${apiUrl}/packages/agents/${agencyId}`
        );
        const agencyPackages = packagesResponse.data || [];
        const agencyPackageIds = agencyPackages.map((pkg) => pkg._id);

        // Filter guides that are assigned to this agency's packages
        const relevantGuides = guidesData.filter((guide) => {
          if (!guide.assignedPackages || guide.assignedPackages.length === 0)
            return false;

          // Check if any of the guide's assigned packages belong to this agency
          return guide.assignedPackages.some((pkg) =>
            agencyPackageIds.includes(pkg.packageId.toString())
          );
        });

        setGuides(relevantGuides);
        setError(null);
      } catch (err) {
        console.error("Error fetching guides:", err);
        setError("Failed to load guides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [agencyId]);

  const handleGuideSelect = async (guideId) => {
    if (!guideId) {
      setSelectedGuide(null);
      setPendingPayments([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch guide details and earnings
      const guideResponse = await axios.get(`${apiUrl}/guides/${guideId}`);
      const earningsResponse = await axios.get(
        `${apiUrl}/guides/${guideId}/earnings`
      );

      // Get agency's packages
      const packagesResponse = await axios.get(
        `${apiUrl}/packages/agents/${agencyId}`
      );
      const agencyPackages = packagesResponse.data || [];
      const agencyPackageIds = agencyPackages.map((pkg) => pkg._id);

      // Filter payments related to this agency's packages
      const allPayments = earningsResponse.data.history || [];
      const agencyRelatedPayments = allPayments.filter(
        (payment) =>
          payment.status === "pending" &&
          agencyPackageIds.includes(payment.packageId?.toString())
      );

      setSelectedGuide(guideResponse.data);
      setPendingPayments(agencyRelatedPayments);
      setError(null);
    } catch (err) {
      console.error("Error fetching guide earnings:", err);
      setError("Failed to load guide payment details.");
      setPendingPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (guideId, earningId) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/guides/${guideId}/earnings/${earningId}/paid`);

      // Show success message
      toast.success("Payment marked as completed successfully");

      // Refresh data
      handleGuideSelect(guideId);
    } catch (error) {
      console.error("Error marking payment as paid:", error);
      toast.error("Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedGuide) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4169E1]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-[#1a365d]">
          Guide Payment Management
        </h1>

        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="card bg-white shadow-lg border border-gray-100 mb-8">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Select Guide</h2>

            {guides.length === 0 ? (
              <p className="text-gray-600">
                No guides are currently assigned to your packages.
              </p>
            ) : (
              <select
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => handleGuideSelect(e.target.value)}
                value={selectedGuide?._id || ""}
              >
                <option value="">Select a guide</option>
                {guides.map((guide) => (
                  <option key={guide._id} value={guide._id}>
                    {guide.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white shadow-lg border border-gray-100"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                Pending Payments for {selectedGuide.name}
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4169E1]"></div>
                </div>
              ) : pendingPayments.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-[#2d3748] mb-2">No pending payments</p>
                  <p className="text-sm text-gray-500">
                    This guide has no pending payments for your packages.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Package</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.map((payment) => (
                        <tr key={payment._id} className="hover">
                          <td>{new Date(payment.date).toLocaleDateString()}</td>
                          <td>{payment.packageName || "N/A"}</td>
                          <td>{payment.customerName || "N/A"}</td>
                          <td>₹{payment.amount?.toFixed(2) || "0.00"}</td>
                          <td>
                            <button
                              className="btn btn-sm bg-[#4169E1] hover:bg-[#1a365d] text-white"
                              onClick={() =>
                                markAsPaid(selectedGuide._id, payment._id)
                              }
                              disabled={loading}
                            >
                              {loading ? "Processing..." : "Mark as Paid"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AgencyPayments;
