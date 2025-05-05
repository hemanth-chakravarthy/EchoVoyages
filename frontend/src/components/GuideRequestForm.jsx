/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import apiUrl from "../utils/api.js";

const GuideRequestForm = ({ packageId, packageName, onRequestSubmitted }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const guideId = token ? jwtDecode(token).id : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !guideId) {
      toast.error("You must be logged in as a guide to submit a request");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "${apiUrl}/guide-requests/guide-to-package",
        {
          guideId,
          packageId,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Request submitted successfully!");
      setMessage("");

      // Call the callback function if provided
      if (onRequestSubmitted) {
        onRequestSubmitted(response.data.data);
      }
    } catch (error) {
      console.error("Error submitting guide request:", error);

      // Display appropriate error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit request. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="text-xl font-bold text-[#1a365d] mb-4">
        Request to Guide "{packageName}"
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message to Agency (Optional)
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Explain why you'd like to guide this package and highlight your relevant experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1a365d] hover:bg-[#2d4a7e] transition-colors duration-300"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </motion.button>
      </form>
    </div>
  );
};

export default GuideRequestForm;
