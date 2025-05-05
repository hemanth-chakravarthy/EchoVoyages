/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix the import here
import { useNavigate } from "react-router-dom";
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

      const response = await fetch("${apiUrl}/bookings", {
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

      const response = await fetch("${apiUrl}/reviews", {
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
      const response = await fetch("${apiUrl}/wishlist", {
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
    return <p>Loading...</p>;
  }

  return (
    <div className="packagedets">
      <h1>{packageDetails.name}</h1>

      {/* <div className="rating-summary" style={{ display: 'inline-flex', alignItems: 'center', margin: '10px 0', backgroundColor: '#FEF9C3', padding: '5px 10px', borderRadius: '20px' }}>
        <span style={{ fontWeight: 'bold', color: '#A16207', marginRight: '5px' }}>
          {packageDetails.reviews && packageDetails.reviews.length > 0
            ? (packageDetails.reviews.reduce((sum, review) => sum + review.rating, 0) / packageDetails.reviews.length).toFixed(1)
            : "0.0"}
        </span>
        <span style={{ color: '#A16207' }}>★</span>
        <span style={{ color: '#4B5563', marginLeft: '5px', fontSize: '0.875rem' }}>
          ({packageDetails.reviews ? packageDetails.reviews.length : 0} {packageDetails.reviews && packageDetails.reviews.length === 1 ? "rating" : "ratings"})
        </span>
      </div> */}

      <p>{packageDetails.description}</p>
      <p>Price: {packageDetails.price}</p>
      <p>Duration: {packageDetails.duration} days</p>
      <p>Location: {packageDetails.location}</p>
      <p>Highlights: {packageDetails.highlights}</p>

      {/* Display images */}
      {packageDetails.image && packageDetails.image.length > 0 ? (
        <div>
          {packageDetails.image.map((img, index) => (
            <img
              key={index}
              src={`${apiUrl}${img}`}
              alt={`Image of ${packageDetails.name}`}
              style={{ width: "300px", height: "200px", marginRight: "10px" }}
            />
          ))}
        </div>
      ) : (
        <p>No images available for this package</p>
      )}

      {/* Display reviews */}
      <div className="reviews-section">
        <h2>Reviews:</h2>
        {revvs && revvs.length > 0 ? (
          revvs.map((review) => (
            <div key={review._id} className="review-item">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <strong style={{ marginRight: "8px" }}>Rating:</strong>
                <div style={{ display: "flex", color: "#F59E0B" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ marginRight: "2px" }}>
                      {star <= review.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
              <p>
                <strong>Reviewed by:</strong>{" "}
                {review.customerName || "Anonymous"}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews for this package yet.</p>
        )}
      </div>

      <button onClick={confirmBooking}>Book</button>
      <button onClick={handleOpenReviewModal}>Add Review</button>
      <button onClick={addToWishlist}>Add to Wishlist</button>

      {/* Modal for adding a review */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Rate and Review</h2>
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

export default ViewPost;
