import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaFlag } from "react-icons/fa";

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
    return <p>Loading...</p>;
  }

  return (
    <div className="guide-details">
      <h1 className="guide-title">{guideDetails.username}</h1>
      <p className="guide-description">{guideDetails.description}</p>
      <p className="guide-experience">
        Experience: {guideDetails.experience} years
      </p>
      <p className="guide-languages">
        Languages: {guideDetails.languages.join(", ")}
      </p>
      <p className="guide-phone">Phone Number: {guideDetails.phno}</p>
      <p className="guide-email">Email: {guideDetails.email}</p>

      <div className="reviews-section">
        <h2 className="reviews-title">Reviews:</h2>
        {revvs && revvs.length > 0 ? (
          revvs.map((review) => (
            <div key={review._id} className="review-item">
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
              <p>
                <strong>Reviewed by:</strong>{" "}
                {review.customerName || "Anonymous"}
              </p>
              <button
                className="report-button"
                onClick={() => handleReportReview(review._id)}
                title="Report this review"
              >
                <FaFlag className="report-icon" />
              </button>
            </div>
          ))
        ) : (
          <p>No reviews for this Guide yet.</p>
        )}
      </div>

      <div className="booking-section">
        <h2 className="booking-title">Book this guide</h2>
        <button className="book-guide-button" onClick={handleBooking}>
          Book Guide
        </button>
        {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
      </div>
      <button className="add-review-button" onClick={handleOpenReviewModal}>
        Add Review
      </button>
      <button className="add-wishlist-button" onClick={handleAddToWishlist}>
        Add to wishlist
      </button>

      {showReviewModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Rate and Review</h2>
            <label className="modal-rating-label">Rating (1 to 5):</label>
            <select
              className="modal-rating-dropdown"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <label className="modal-comment-label">Comment:</label>
            <textarea
              className="modal-comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />
            <button
              className="modal-submit-button"
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
            <button
              className="modal-close-button"
              onClick={handleCloseReviewModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGuide;