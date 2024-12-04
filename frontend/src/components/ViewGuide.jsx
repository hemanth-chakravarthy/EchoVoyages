import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaFlag, FaStar } from "react-icons/fa";
import Navbar from '../components/Navbar';

const ViewGuide = () => {
  const { id } = useParams();
  const [guideDetails, setGuideDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revvs, setRevDetails] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const token = localStorage.getItem("token");
  const customerId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/guides/${id}`);
        setGuideDetails(response.data);
      } catch (error) {
        console.error("Error fetching guide details:", error);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reviews/guides/${id}`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
    fetchGuideDetails();
  }, [id]);

  const handleBooking = async () => {
    try {
      if (!customerId) {
        setBookingStatus("Customer is not authenticated. Please log in.");
        return;
      }
      const packageId = null;
      const bookingData = {
        customerId,
        guideId: guideDetails._id,
        packageId: packageId || null,
      };
      const response = await axios.post(
        "http://localhost:5000/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setBookingStatus("Booking confirmed successfully!");
      } else {
        setBookingStatus("Failed to book the guide.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
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
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          guideId: id,
          rating,
          comment,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Review submitted:", result);
        alert("Review submitted successfully!");
        handleCloseReviewModal();
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
  const handleAddToWishlist = async () => {
    try {
      if (!customerId) {
        setBookingStatus("Customer is not authenticated. Please log in.");
        return;
      }
      const wishlistData = {
        customerId,
        guideId: guideDetails._id,
      };
      const response = await axios.post(
        "http://localhost:5000/wishlistGuides",
        wishlistData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Guide added to wishlist successfully!");
      } else {
        alert("Failed to add guide to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("An error occurred while adding to wishlist.");
    }
  };

  if (!guideDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-white text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden p-8">
          <h1 className="text-4xl font-bold text-white mb-6">{guideDetails.username}</h1>
          <p className="text-gray-300 mb-4">{guideDetails.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <p className="text-gray-300"><span className="font-semibold">Experience:</span> {guideDetails.experience} years</p>
            <p className="text-gray-300"><span className="font-semibold">Languages:</span> {guideDetails.languages.join(", ")}</p>
            <p className="text-gray-300"><span className="font-semibold">Phone Number:</span> {guideDetails.phno}</p>
            <p className="text-gray-300"><span className="font-semibold">Email:</span> {guideDetails.email}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
            {revvs && revvs.length > 0 ? (
              <div className="space-y-4">
                {revvs.map((review) => (
                  <div key={review._id} className="bg-white bg-opacity-5 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-400"} />
                      ))}
                      <span className="ml-2 text-gray-300">{review.rating} / 5</span>
                    </div>
                    <p className="text-gray-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-400">Reviewed by: {review.customerName || "Anonymous"}</p>
                    <button
                      className="mt-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      onClick={() => handleReportReview(review._id)}
                      title="Report this review"
                    >
                      <FaFlag className="inline mr-1" /> Report
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">No reviews for this Guide yet.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              className="bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300"
              onClick={handleBooking}
            >
              Book Guide
            </button>
            <button
              className="bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300"
              onClick={handleOpenReviewModal}
            >
              Add Review
            </button>
            <button
              className="bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300"
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>
          </div>

          {bookingStatus && (
            <p className="text-center text-lg font-semibold text-white bg-opacity-50 bg-green-500 rounded-full py-2 px-4">
              {bookingStatus}
            </p>
          )}
        </div>
      </main>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Rate and Review</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating:</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment:</label>
              <textarea
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition-colors duration-300"
                onClick={handleCloseReviewModal}
              >
                Close
              </button>
              <button
                className="bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGuide;

