import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode correctly
import axios from 'axios';

const ViewGuide = () => {
    const { id } = useParams(); // Get the guide ID from the URL
    const [guideDetails, setGuideDetails] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(1); // Default rating value
    const [comment, setComment] = useState(''); // Comment value
    const [bookingStatus, setBookingStatus] = useState(''); // For displaying booking status
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Decode the token to get the customerId
    const customerId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/guides/${id}`);
                setGuideDetails(response.data);
            } catch (error) {
                console.error('Error fetching guide details:', error);
            }
        };

        fetchGuideDetails();
    }, [id]);

    // Function to handle booking submission
    const handleBooking = async () => {
        try {
            if (!customerId) {
                setBookingStatus('Customer is not authenticated. Please log in.');
                return;
            }
    
            // Assuming you have packageId from somewhere (e.g., a selected package)
            const packageId = null; // Change this as per your actual packageId source
    
            const bookingData = {
                customerId,   // Use decoded customer ID from token
                guideId: guideDetails._id, // Use guide ID
                packageId: packageId || null,  // Optional packageId
            };
    
            const response = await axios.post('http://localhost:5000/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in headers if required
                },
            });
    
            if (response.status === 201) { // 201 for successful creation
                setBookingStatus('Booking confirmed successfully!');
            } else {
                setBookingStatus('Failed to book the guide.');
            }
        } catch (error) {
            console.error('Error during booking:', error);
            setBookingStatus('An error occurred while booking.');
        }
    };
    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
      };
      const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setRating(1); // Reset rating
        setComment(''); // Reset comment
      };
    
      // Submit the review
      const handleSubmitReview = async () => {
        try {
          const response = await fetch('http://localhost:5000/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include token for authentication
            },
            body: JSON.stringify({
              customerId,    // Logged-in user's customerId
              guideId: id,  // Use the package name from the package details
              rating,  // Rating value from the form
              comment,  // Comment from the form
            }),
          });
    
          if (response.ok) {
            const result = await response.json();
            console.log('Review submitted:', result);
            alert('Review submitted successfully!');
            handleCloseReviewModal(); // Close the modal
          } else {
            const errorData = await response.json();
            console.error('Failed to submit review:', errorData.message);
            alert(`Failed to submit review: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          alert('An error occurred while submitting the review.');
        }
      };

    if (!guideDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className="guide-details">
            <h1>{guideDetails.username}</h1>
            <p>{guideDetails.description}</p>
            <p>Experience: {guideDetails.experience} years</p>
            <p>Languages: {guideDetails.languages.join(', ')}</p>

            {/* Display booking section */}
            <div className="booking-section">
                <h2>Book this guide</h2>
                <button onClick={handleBooking}>Book Guide</button>
                {bookingStatus && <p>{bookingStatus}</p>}
            </div>
            <button onClick={handleOpenReviewModal}>Add Review</button>
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

export default ViewGuide;
