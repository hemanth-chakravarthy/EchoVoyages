/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaStar,
  FaHeart,
  FaCalendarAlt,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

const ViewPost = () => {
  const { id } = useParams(); // Get the package ID from the URL
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setRevDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false); // Modal visibility state
  const [rating, setRating] = useState(1); // Default rating value
  const [comment, setComment] = useState(""); // Comment value
  const customerId = jwtDecode(localStorage.getItem("token")).id;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/packages/${id}`);
        const data = await response.json();
        setPackageDetails(data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };
    const fetchReviews = async () => {
      try {
        // Fetch reviews from the reviews collection for this package
        const res = await fetch(`${apiUrl}/reviews/package/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRevDetails(data);
        } else {
          console.log("No reviews found in reviews collection");
          setRevDetails([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setRevDetails([]);
      }
    };
    fetchReviews();
    fetchPackageDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!customerId) {
      alert("Please log in to book the package.");
      return;
    }

    try {
      console.log("Sending booking request with:", {
        customerId,
        packageId: id,
      });

      const response = await fetch(`${apiUrl}/bookings`, {
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
        const result = await response.json();
        console.log("Booking details:", result);
        alert(
          `Booking successful! Your booking ID is: ${result.bookingId || result._id}`
        );
        navigate("/home");
      } else {
        const errorData = await response.json();
        console.error("Failed to book the package:", errorData.message);
        alert(`Failed to book the package: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error booking package:", error);
      alert("An error occurred while booking the package.");
    }
  };

  const confirmBooking = () => {
    const isConfirmed = window.confirm("Do you want to confirm the booking?");
    if (isConfirmed) {
      handleBooking(); // Proceed with booking if the user confirms
    }
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
  };

  // Submit the review
  const handleSubmitReview = async () => {
    try {
      // First, check if the user has a booking for this package
      const bookingsResponse = await fetch(
        `${apiUrl}/bookings/cust/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!bookingsResponse.ok) {
        alert("Failed to verify booking. Please try again.");
        return;
      }

      const bookings = await bookingsResponse.json();

      // Find a booking for this package
      const booking = bookings.find((b) => b.packageId === id);

      if (!booking) {
        alert("You can only review packages that you have booked.");
        return;
      }

      // Display the booking ID to the user
      const bookingIdToShow = booking.bookingId || booking._id;
      alert(`Using booking ID: ${bookingIdToShow} for your review`);

      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Use the package ID from the URL
          rating, // Rating value from the form
          comment, // Comment from the form
          bookingId: booking._id, // Include the booking ID
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Review submitted:", result);
        alert("Review submitted successfully!");
        handleCloseReviewModal(); // Close the modal
      } else {
        const errorData = await response.json();
        console.error("Failed to submit review:", errorData.message);
        alert(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting the review.");
    }
  };

  // This function is not used, so we're removing it to avoid unused variable warnings
  const addToWishlist = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Current package ID from URL params
        }),
      });

      if (response.ok) {
        await response.json(); // We're not using the result, just acknowledging the response
        alert("Package added to wishlist successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to add to wishlist: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("An error occurred while adding to the wishlist.");
    }
  };

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black/40">Loading...</p>
        </div>
      </div>
    );
  }

  const averageRating = revvs && revvs.length > 0
    ? (revvs.reduce((sum, review) => sum + review.rating, 0) / revvs.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-12 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/60 hover:text-[#1a1a1a] transition-colors mb-8"
        >
          <FaArrowLeft /> Back
        </button>

        <span className="block text-xs font-bold tracking-[0.3em] text-black/40 uppercase mb-4">
          001 / Package Details
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] mb-6">
          {packageDetails.name}
        </h1>

        {/* Rating Badge */}
        <div className="inline-flex items-center gap-3 bg-[#FFC107] px-4 py-2">
          <FaStar className="text-[#1a1a1a]" />
          <span className="font-bold text-[#1a1a1a]">{averageRating}</span>
          <span className="text-sm text-black/70">({revvs?.length || 0} reviews)</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images Gallery */}
            {packageDetails.image && packageDetails.image.length > 0 && (
              <div className="bg-white border border-black/5 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                  {packageDetails.image.map((img, index) => (
                    <div key={index} className="aspect-[4/3] overflow-hidden bg-black/5">
                      <img
                        src={`${apiUrl}${img}`}
                        alt={`${packageDetails.name} - ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-black/5 p-8">
              <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-4">
                002 / About
              </span>
              <p className="text-black/70 leading-relaxed">{packageDetails.description}</p>
            </div>

            {/* Highlights */}
            {packageDetails.highlights && (
              <div className="bg-white border border-black/5 p-8">
                <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-4">
                  003 / Highlights
                </span>
                <p className="text-black/70 leading-relaxed">{packageDetails.highlights}</p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white border border-black/5 p-8">
              <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-6">
                004 / Reviews
              </span>

              {revvs && revvs.length > 0 ? (
                <div className="space-y-6">
                  {revvs.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-[#1a1a1a] pl-6 py-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={star <= review.rating ? "text-[#FFC107]" : "text-black/20"}
                          />
                        ))}
                      </div>
                      <p className="text-black/70 mb-3 leading-relaxed">{review.comment}</p>
                      <div className="flex items-center gap-2 text-xs text-black/40 uppercase tracking-wider">
                        <FaUser className="text-xs" />
                        <span>{review.customerName || "Anonymous"}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-black/40 text-sm uppercase tracking-wider">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/5 p-8 sticky top-6">
              <span className="block text-xs font-bold tracking-[0.2em] text-black/40 uppercase mb-6">
                Package Info
              </span>

              {/* Price */}
              <div className="border-l-4 border-[#1a1a1a] pl-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FaDollarSign className="text-[#1a1a1a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-black/40">Price</span>
                </div>
                <p className="text-3xl font-bold text-[#1a1a1a]">${packageDetails.price}</p>
              </div>

              {/* Duration */}
              <div className="border-l-4 border-[#1a1a1a] pl-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-[#1a1a1a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-black/40">Duration</span>
                </div>
                <p className="text-xl font-bold text-[#1a1a1a]">{packageDetails.duration} days</p>
              </div>

              {/* Location */}
              <div className="border-l-4 border-[#1a1a1a] pl-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-[#1a1a1a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-black/40">Location</span>
                </div>
                <p className="text-xl font-bold text-[#1a1a1a]">{packageDetails.location}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={confirmBooking}
                  className="w-full px-6 py-4 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all flex items-center justify-center gap-3"
                >
                  <FaCalendarAlt />
                  Book Package
                </button>

                <button
                  onClick={handleOpenReviewModal}
                  className="w-full px-6 py-4 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <FaStar />
                  Add Review
                </button>

                <button
                  onClick={addToWishlist}
                  className="w-full px-6 py-4 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <FaHeart />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full border border-black/5"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Add Your Review</h2>
                <button
                  onClick={handleCloseReviewModal}
                  className="p-2 hover:bg-black/5 transition-colors"
                >
                  <FaTimes className="text-[#1a1a1a]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-3">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-black/10 text-sm font-semibold text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/40 mb-3">
                    Your Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-black/10 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] resize-none"
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 px-6 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={handleCloseReviewModal}
                    className="px-6 py-3 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default ViewPost;
