/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiUrl from "../utils/api.js";
import {
  FaFlag,
  FaStar,
  FaUser,
  FaBriefcase,
  FaLanguage,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaHeart,
  FaEdit,
  FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ViewGuide = () => {
  const { id } = useParams();
  const [guideDetails, setGuideDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revvs, setRevDetails] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const token = localStorage.getItem("token");
  const [bookingId, setBookingId] = useState("");
  const [customerBookings, setCustomerBookings] = useState([]);
  const [userRole, setUserRole] = useState(""); // "customer", "agency", or "guide"
  const [hoveredRating, setHoveredRating] = useState(0);
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/guides/${id}`);
        setGuideDetails(response.data);
      } catch (error) {
        console.error("Error fetching guide details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/reviews/guides/${id}/reviews`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const determineUserRole = async () => {
      if (!token || !userId) {
        setUserRole("guest");
        return;
      }

      try {
        // Check if user is a customer
        const customerResponse = await axios.get(
          `${apiUrl}/customers/${userId}`
        );
        if (customerResponse.data) {
          setUserRole("customer");
          return;
        }
      } catch (error) {
        // Not a customer, continue checking
      }

      try {
        // Check if user is an agency
        const agencyResponse = await axios.get(`${apiUrl}/agency/${userId}`);
        if (agencyResponse.data) {
          setUserRole("agency");
          return;
        }
      } catch (error) {
        // Not an agency, continue checking
      }

      try {
        // Check if user is a guide
        const guideResponse = await axios.get(`${apiUrl}/guides/${userId}`);
        if (guideResponse.data) {
          setUserRole("guide");
          return;
        }
      } catch (error) {
        // Not a guide either
        console.error("Could not determine user role:", error);
        setUserRole("guest");
      }
    };

    fetchReviews();
    fetchGuideDetails();
    determineUserRole();
  }, [id, userId, token]);

  // Fetch customer bookings when userRole is determined
  useEffect(() => {
    const fetchCustomerBookings = async () => {
      if (userId && token && userRole === "customer") {
        try {
          const response = await axios.get(
            `${apiUrl}/bookings/cust/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Filter bookings for this guide
          const guideBookings = response.data.filter(
            (booking) => booking.guideId === id
          );
          setCustomerBookings(guideBookings);
        } catch (error) {
          console.error("Error fetching customer bookings:", error);
        }
      }
    };

    if (userRole) {
      fetchCustomerBookings();
    }
  }, [id, userId, token, userRole]);

  const handleBooking = async () => {
    try {
      if (!userId || userRole !== "customer") {
        setBookingStatus(
          "You must be logged in as a customer to book a guide."
        );
        return;
      }

      const packageId = null;
      const bookingData = {
        customerId: userId,
        guideId: guideDetails._id,
        packageId: packageId || null,
      };

      const response = await axios.post("${apiUrl}/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Booking confirmed successfully!");
        setBookingStatus("Booking confirmed successfully!");
      } else {
        toast.error("Failed to book the guide.");
        setBookingStatus("Failed to book the guide.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      toast.error("An error occurred while booking.");
      setBookingStatus("An error occurred while booking.");
    }
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(1);
    setComment("");
  };

  const handleSubmitReview = async () => {
    try {
      if (!userId || userRole !== "customer") {
        toast.error("You must be logged in as a customer to submit a review.");
        return;
      }

      const response = await fetch("${apiUrl}/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: userId,
          guideId: id,
          bookingId, // Include bookingId in the payload
          rating,
          comment,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Review submitted:", result);
        toast.success("Review submitted successfully!");
        handleCloseReviewModal();
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

  const handleAddToWishlist = async () => {
    try {
      if (!userId || userRole !== "customer") {
        toast.error(
          "You must be logged in as a customer to add a guide to your wishlist."
        );
        return;
      }

      const wishlistData = {
        customerId: userId,
        guideId: guideDetails._id,
      };

      const response = await axios.post(
        "${apiUrl}/wishlistGuides",
        wishlistData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Guide added to wishlist successfully!");
      } else {
        toast.error("Failed to add guide to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(`${error.message}`);
    }
  };

  const handleReportReview = (reviewId) => {
    // Implement report review functionality
    toast.info("Review reported. Our team will review it shortly.");
  };

  if (!guideDetails) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Guide Header */}
          <div className="relative">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/guide-banner.png"
                alt="Travel Agency Banner"
                className="w-full h-full object-cover"
              />
              {/* Optional overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a66c2]/40 to-[#004182]/40"></div>
            </div>
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-[#e9e5df] flex items-center justify-center overflow-hidden">
                {guideDetails.profilePicture ? (
                  <img
                    src={`${apiUrl}/${guideDetails.profilePicture}`}
                    alt={guideDetails.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-[#56687a] text-5xl" />
                )}
              </div>
            </div>
          </div>

          {/* Guide Info */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[#38434f]">
                  {guideDetails.username}
                </h1>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-[#e7a33e]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i <
                          Math.round(guideDetails.ratings?.averageRating || 0)
                            ? "text-[#e7a33e]"
                            : "text-[#e9e5df]"
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[#56687a]">
                    {guideDetails.ratings &&
                    guideDetails.ratings.averageRating > 0
                      ? guideDetails.ratings.averageRating.toFixed(1)
                      : "0.0"}{" "}
                    (
                    {guideDetails.ratings
                      ? guideDetails.ratings.numberOfReviews
                      : 0}{" "}
                    {guideDetails.ratings &&
                    guideDetails.ratings.numberOfReviews === 1
                      ? "rating"
                      : "ratings"}
                    )
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                {userRole === "customer" && (
                  <>
                    <button
                      onClick={handleBooking}
                      className="bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors flex items-center"
                    >
                      <FaCalendarAlt className="mr-2" /> Book Guide
                    </button>
                    <button
                      onClick={handleOpenReviewModal}
                      className="bg-[#f3f6f8] text-[#0a66c2] px-4 py-2 rounded hover:bg-[#dce6f1] transition-colors flex items-center"
                    >
                      <FaEdit className="mr-2" /> Add Review
                    </button>
                    <button
                      onClick={handleAddToWishlist}
                      className="bg-[#f3f6f8] text-[#0a66c2] px-4 py-2 rounded hover:bg-[#dce6f1] transition-colors flex items-center"
                    >
                      <FaHeart className="mr-2" /> Add to Wishlist
                    </button>
                  </>
                )}

                {userRole === "agency" && (
                  <button
                    onClick={() =>
                      (window.location.href = `/agency-guide-directory`)
                    }
                    className="bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors flex items-center"
                  >
                    <FaArrowLeft className="mr-2" /> Back to Guide Directory
                  </button>
                )}

                {userRole === "guide" && (
                  <button
                    onClick={() => (window.location.href = `/GuideHome`)}
                    className="bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors flex items-center"
                  >
                    <FaArrowLeft className="mr-2" /> Back to Dashboard
                  </button>
                )}

                {(userRole === "guest" || !userRole) && (
                  <button
                    onClick={() => (window.location.href = `/login`)}
                    className="bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors flex items-center"
                  >
                    <FaUser className="mr-2" /> Login to Book
                  </button>
                )}
              </div>
            </div>

            {bookingStatus && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  bookingStatus.includes("successfully")
                    ? "bg-[#eaf5ea] text-[#44712e]"
                    : "bg-[#f5e9e5] text-[#b24020]"
                }`}
              >
                {bookingStatus}
              </div>
            )}

            <div className="bg-[#f3f6f8] p-4 rounded-lg mb-6">
              <p className="text-[#38434f]">{guideDetails.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  icon: <FaBriefcase className="text-[#0a66c2]" />,
                  label: "Experience",
                  value: `${guideDetails.experience} years`,
                },
                {
                  icon: <FaLanguage className="text-[#0a66c2]" />,
                  label: "Languages",
                  value: guideDetails.languages.join(", "),
                },
                {
                  icon: <FaPhone className="text-[#0a66c2]" />,
                  label: "Phone Number",
                  value: guideDetails.phno,
                },
                {
                  icon: <FaEnvelope className="text-[#0a66c2]" />,
                  label: "Email",
                  value: guideDetails.gmail,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#dce6f1] rounded-lg p-4"
                >
                  <div className="flex items-center mb-2">
                    <div className="mr-3">{item.icon}</div>
                    <h3 className="text-[#56687a] font-medium">{item.label}</h3>
                  </div>
                  <p className="text-[#38434f] pl-8">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Reviews Section */}
            <div className="border-t border-[#e9e5df] pt-6 mt-6">
              <h2 className="text-xl font-bold text-[#38434f] mb-4">Reviews</h2>

              {revvs && revvs.length > 0 ? (
                <div className="space-y-4">
                  {revvs.map((review) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#f3f6f8] rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center text-[#e7a33e] mb-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-[#e7a33e]"
                                    : "text-[#e9e5df]"
                                }
                              />
                            ))}
                            <span className="ml-2 text-[#56687a]">
                              {review.rating} / 5
                            </span>
                          </div>
                          <p className="text-[#56687a] text-sm">
                            By {review.customerName || "Anonymous"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleReportReview(review._id)}
                          className="text-[#56687a] hover:text-[#b24020] transition-colors"
                          aria-label="Report review"
                        >
                          <FaFlag />
                        </button>
                      </div>
                      <p className="text-[#38434f] mt-2">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#f3f6f8] rounded-lg p-6 text-center">
                  <p className="text-[#56687a]">
                    No reviews for this Guide yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-[#38434f] mb-4">
              Rate and Review
            </h2>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Select Your Booking:
              </label>
              {customerBookings.length > 0 ? (
                <select
                  className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
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
                <p className="text-[#b24020]">
                  You haven't booked this guide yet. Please book the guide
                  before leaving a review.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Rating:
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <FaStar
                    key={value}
                    className={`text-2xl cursor-pointer ${
                      value <= (hoveredRating || rating)
                        ? "text-[#e7a33e]"
                        : "text-[#e9e5df]"
                    }`}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
                <span className="ml-2 text-[#56687a]">{rating} of 5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Comment:
              </label>
              <textarea
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseReviewModal}
                className="px-4 py-2 border border-[#dce6f1] rounded text-[#56687a] hover:bg-[#f3f6f8] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
                disabled={!bookingId && customerBookings.length > 0}
              >
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ViewGuide;
