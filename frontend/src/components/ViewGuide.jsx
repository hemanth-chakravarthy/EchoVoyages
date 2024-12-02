import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaFlag } from "react-icons/fa";

const ViewGuide = () => {
  const { id } = useParams();
  const [guideDetails, setGuideDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState(null);
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
        const res = await axios.get(`http://localhost:5000/reviews/guides/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchGuideDetails();
    fetchReviews();
  }, [id]);

  const handleBooking = async () => {
    try {
      if (!customerId) {
        setBookingStatus("Customer is not authenticated. Please log in.");
        return;
      }
      const bookingData = {
        customerId,
        guideId: guideDetails._id,
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
      setBookingStatus(
        response.status === 201 ? "Booking confirmed successfully!" : "Failed to book the guide."
      );
    } catch (error) {
      console.error("Error during booking:", error);
      setBookingStatus("An error occurred while booking.");
    }
  };

  const handleSubmitReview = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/reviews",
        {
          customerId,
          guideId: id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Review submitted successfully!");
        setShowReviewModal(false);
        setRating(1);
        setComment("");
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting the review.");
    }
  };

  if (!guideDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="guide-details">
      <h1>{guideDetails.username}</h1>
      <p>
        <strong>Name:</strong> {guideDetails.name}
      </p>
      <p>
        <strong>Experience:</strong> {guideDetails.experience} years
      </p>
      <p>
        <strong>Languages:</strong> {guideDetails.languages.join(", ")}
      </p>
      <p>
        <strong>Location:</strong> {guideDetails.location}
      </p>
      <p>
        <strong>Phone:</strong> {guideDetails.phone}
      </p>
      <p>
        <strong>Email:</strong> {guideDetails.email}
      </p>
      <p>
        <strong>Specialization:</strong> {guideDetails.specialization}
      </p>
      <p>
        <strong>Availability:</strong> {guideDetails.availability ? "Available" : "Not Available"}
      </p>
      <p>
        <strong>Rating:</strong> {guideDetails.ratings.averageRating} / 5 ({guideDetails.ratings.numberOfReviews} reviews)
      </p>
      <p>
        <strong>Verified:</strong> {guideDetails.isverified ? "Yes" : "No"}
      </p>

      {guideDetails.assignedPackages.length > 0 && (
        <div>
          <h2>Assigned Packages:</h2>
          <ul>
            {guideDetails.assignedPackages.map((pkg) => (
              <li key={pkg.packageId}>
                <p>
                  <strong>Package ID:</strong> {pkg.packageId}
                </p>
                <p>
                  <strong>Price:</strong> ${pkg.price}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="reviews-section">
        <h2>Reviews:</h2>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id}>
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <button onClick={handleBooking}>Book Guide</button>
      <button onClick={() => setShowReviewModal(true)}>Add Review</button>

      {showReviewModal && (
        <div className="modal">
          <h2>Add Review</h2>
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <label>
            Comment:
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <button onClick={handleSubmitReview}>Submit</button>
          <button onClick={() => setShowReviewModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ViewGuide;
