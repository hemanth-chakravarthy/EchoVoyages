import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CustomerPackActions = () => {
  const { id } = useParams(); // Get the package ID from the URL
  const [showReviewModal, setShowReviewModal] = useState(false); // Modal visibility state
  const [rating, setRating] = useState(1); // Default rating value
  const [comment, setComment] = useState(""); // Comment value
  const [bookingId, setBookingId] = useState(""); // State for booking ID
  const customerId = jwtDecode(localStorage.getItem("token")).id;
  const guideId = ""; // Guide ID, can be empty or used as needed
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Function to handle booking
  const handleBooking = async () => {
    if (!customerId) {
      alert("Please log in to book the package.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Current package ID from URL params
          // guideId: someGuideId // Only include if booking a guide
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Booking details:", result);
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

  // Function to confirm booking
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
    setBookingId(""); // Reset booking ID
  };

  // Function to submit the review
  const handleSubmitReview = async () => {
    if (!bookingId) {
      alert("Please enter the Booking ID.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reviews", {
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

  // Handle adding to wishlist
  const addToWishlist = async () => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
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

  return (
    <div className="button-actions">
      <button onClick={confirmBooking}>Book</button>
      <button onClick={handleOpenReviewModal}>Add Review</button>
      <button onClick={addToWishlist}>Add to Wishlist</button>

      {/* Modal for adding a review */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Rate and Review</h2>

            <label>Booking ID:</label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />

            <label>Rating (1 to 5):</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />

            <button onClick={handleSubmitReview}>Submit Review</button>
            <button onClick={handleCloseReviewModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPackActions;
