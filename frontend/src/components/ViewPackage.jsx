import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaFlag } from 'react-icons/fa'; // Import report flag icon

const ViewPackage = () => {
  const { id } = useParams(); // Get the package ID from the URL
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setRevDetails] = useState(null);

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
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reviews/package/${id}`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
    fetchPackageDetails();
  }, [id]);

  const handleReportReview = async (reviewId) => {
    try {
      const response = await axios.post(`http://localhost:5000/reviews/${reviewId}`);
      if (response.status === 200) {
        alert('Review has been reported successfully!');
      } else {
        alert('Failed to report the review.');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      alert('An error occurred while reporting the review.');
    }
  };

  if (!packageDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className='packagedets'>
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

      {/* Display reviews */}
      <div className="reviews-section">
        <h2>Reviews:</h2>
        {revvs && revvs.length > 0 ? (
          revvs.map((review) => (
            <div key={review._id} className="review-item">
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p><strong>Comment:</strong> {review.comment}</p>
              <p><strong>Reviewed by:</strong> {review.customerName || 'Anonymous'}</p>
              {/* Report button */}
              <button
                className="report-button"
                onClick={() => handleReportReview(review._id)}
                title="Report this review"
              >
                <FaFlag style={{ color: 'red' }} /> {/* Report icon */}
              </button>
            </div>
          ))
        ) : (
          <p>No reviews for this package yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewPackage;
