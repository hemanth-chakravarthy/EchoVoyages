import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ViewPost = () => {
  const { id } = useParams(); // Get the package ID from the URL
  const [packageDetails, setPackageDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false); // Modal visibility state
  const [rating, setRating] = useState(1); // Default rating value
  const [comment, setComment] = useState(''); // Comment value
  const customerId = jwtDecode(localStorage.getItem('token')).id;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/packages/${id}`);
        const data = await response.json();
        setPackageDetails(data);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackageDetails();
  }, [id]);
  

  const handleBooking = async () => {
    console.log(customerId);
    const token = localStorage.getItem('token');
    console.log (jwtDecode(token))
    if (!customerId) {
      alert("Please log in to book the package.");
      return;
    }
    console.log(token)
    try {
      const response = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include token for authentication
        },
        body: JSON.stringify({
          customerId,    // Logged-in user's customerId
          packageId: id, // Current package ID from URL params
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking details:', result);
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('Failed to book the package:', errorData.message);
        alert(`Failed to book the package: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error booking package:', error);
      alert('An error occurred while booking the package.');
    }
  };

  const confirmBooking = () => {
    const isConfirmed = window.confirm('Do you want to confirm the booking?');
    if (isConfirmed) {
      handleBooking();  // Proceed with booking if the user confirms
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
    setComment(''); // Reset comment
  };

  // Submit the review
  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
            customerId,    // Logged-in user's customerId
            packageId: id,  // Use the package name from the package details
            rating,  // Rating value from the form
            comment,  // Comment from the form
          // You don't need to send the date or status as they have defaults in the schema
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
  

  if (!packageDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{packageDetails.name}</h1>
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
              src={`http://localhost:5000${img}`}
              alt={`Image of ${packageDetails.name}`}
              style={{ width: '300px', height: '200px', marginRight: '10px' }}
            />
          ))}
        </div>
      ) : (
        <p>No images available for this package</p>
      )}
      <button onClick={confirmBooking}>Book</button>
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

export default ViewPost;
