/** @format */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiUrl from "../utils/api.js";

const CustomerPackActions = () => {
  const { id } = useParams(); // `id` is the packageId
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("book");
  const [showReviewModal, setShowReviewModal] = useState(false); // Modal visibility state
  const [rating, setRating] = useState(1); // Default rating value
  const [comment, setComment] = useState(""); // Comment value
  const [bookingId, setBookingId] = useState(""); // State for booking ID
  const [customerBookings, setCustomerBookings] = useState([]); // State for customer bookings
  const [customDetails, setCustomDetails] = useState({
    price: 0,
    duration: 0,
    itinerary: "",
    availableDates: [],
    maxGroupSize: 1,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const customerId = jwtDecode(token).id;

  // Fetch package details and customer bookings
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!showRequestModal) return; // Fetch only when modal is shown
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const packageData = await response.json();
          setCustomDetails({
            price: packageData.price || 0,
            duration: packageData.duration || 0,
            itinerary: packageData.itinerary || "",
            availableDates: packageData.availableDates || [],
            maxGroupSize: packageData.maxGroupSize || 1,
          });
        } else {
          console.error("Failed to fetch package details.");
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch customer bookings for this package
    const fetchCustomerBookings = async () => {
      if (customerId && token && showReviewModal) {
        try {
          const response = await axios.get(
            `${apiUrl}/bookings/cust/${customerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Filter bookings for this package
          const packageBookings = response.data.filter(
            (booking) => booking.packageId === id
          );

          setCustomerBookings(packageBookings);
        } catch (error) {
          console.error("Error fetching customer bookings:", error);
        }
      }
    };

    fetchPackageDetails();
    fetchCustomerBookings();
  }, [showRequestModal, showReviewModal, id, token, customerId]);

  const handleRequestSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          packageId: id,
          requestType,
          ...customDetails,
          message,
        }),
      });
      if (response.ok) {
        toast.success(`Request submitted successfully as ${requestType}.`);
        setShowRequestModal(false);
        navigate("/home");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("An error occurred while submitting the request.");
    }
  };

  const handleCustomDetailsChange = (key, value) => {
    setCustomDetails((prev) => ({ ...prev, [key]: value }));
  };
  // Handle opening the review modal
  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };
  // Handle closing the review modal
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(1); // Reset rating
    setComment(""); // Reset comment
    setBookingId(""); // Reset booking ID
  };

  // Function to submit the review
  const handleSubmitReview = async () => {
    if (!bookingId) {
      toast.error("Please enter the Booking ID.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Use the package ID from the URL params
          rating, // Rating value from the form
          comment, // Comment from the form
          bookingId, // Include the booking ID
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Review submitted:", result);
        toast.success("Review submitted successfully!");
        handleCloseReviewModal(); // Close the modal
      } else {
        const errorData = await response.json();
        console.error("Failed to submit review:", errorData.message);
        toast.error(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  // Handle adding to wishlis
  const addToWishlist = async () => {
    try {
      const response = await fetch(`${apiUrl}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Current package ID from URL params
        }),
      });

      if (response.ok) {
        toast.success("Package added to wishlist successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add to wishlist: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("An error occurred while adding to the wishlist.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.main
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <div className="flex justify-center gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRequestModal(true)}
            className="bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
          >
            Customize / Book
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenReviewModal}
            className="bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
          >
            Add Review
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addToWishlist}
            className="bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
          >
            Add to Wishlist
          </motion.button>
        </div>

        {/* Modal for Request */}
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-lg"
            >
              <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">
                {requestType === "book" ? "Book Package" : "Customize Package"}
              </h2>
              {isLoading ? (
                <p className="text-base-content">Loading package details...</p>
              ) : (
                <>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">
                        Request Type:
                      </span>
                    </label>
                    <select
                      name="requestType"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300"
                    >
                      <option value="book">Book</option>
                      <option value="customize">Customize</option>
                    </select>
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">Price:</span>
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={customDetails.price}
                      onChange={(e) =>
                        handleCustomDetailsChange("price", e.target.value)
                      }
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">
                        Duration (days):
                      </span>
                    </label>
                    <input
                      name="duration"
                      type="number"
                      value={customDetails.duration}
                      onChange={(e) =>
                        handleCustomDetailsChange(
                          "duration",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">Itinerary:</span>
                    </label>
                    <textarea
                      name="itinerary"
                      value={customDetails.itinerary}
                      onChange={(e) =>
                        handleCustomDetailsChange("itinerary", e.target.value)
                      }
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300 resize-none"
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">
                        Select Date:
                      </span>
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        handleCustomDetailsChange("availableDates", [date]);
                      }}
                      minDate={new Date()} // Disable past dates
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Click to select a date"
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">
                        Max Group Size:
                      </span>
                    </label>
                    <input
                      name="maxGroupSize"
                      type="number"
                      value={customDetails.maxGroupSize}
                      onChange={(e) =>
                        handleCustomDetailsChange(
                          "maxGroupSize",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="text-black font-medium">Message:</span>
                    </label>
                    <textarea
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300 resize-none"
                      rows="3"
                      placeholder="Any special requests or additional information..."
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  name="submit"
                  onClick={handleRequestSubmit}
                  className="bg-[#00072D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                >
                  Submit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  name="cancel"
                  onClick={() => setShowRequestModal(false)}
                  className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-all duration-300 shadow-md"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Review Modal with updated styling */}
        {showReviewModal && (
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
              <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6 text-center">
                Rate and Review
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Your Booking:
                </label>
                {customerBookings.length > 0 ? (
                  <select
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                  >
                    <option value="">Select a booking</option>
                    {customerBookings.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {booking.bookingId || booking._id} -{" "}
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-red-500 p-2 bg-red-50 rounded-md">
                    <p>
                      You haven't booked this package yet. Please book the
                      package before leaving a review.
                    </p>
                  </div>
                )}
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="text-black font-medium">
                    Rating (1 to 5):
                  </span>
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full text-black p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300"
                >
                  <option className="text-black" value="1">
                    1
                  </option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="text-black font-medium">Comment:</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition-all duration-300 resize-none text-black"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={bookingId ? { scale: 1.05 } : {}}
                  whileTap={bookingId ? { scale: 0.95 } : {}}
                  onClick={handleSubmitReview}
                  disabled={!bookingId || customerBookings.length === 0}
                  className={`font-semibold py-2 px-6 rounded-md transition-all duration-300 shadow-md ${
                    bookingId && customerBookings.length > 0
                      ? "bg-[#00072D] text-white hover:bg-[#1a365d]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseReviewModal}
                  className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-all duration-300 shadow-md"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
};
export default CustomerPackActions;
