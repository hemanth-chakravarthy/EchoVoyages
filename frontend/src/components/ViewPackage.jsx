import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaFlag } from 'react-icons/fa'; 
import "../styles/ViewPackage.css";

const ViewPackage = () => {
  const { id } = useParams(); 
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setRevDetails] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/packages/${id}`);
        const data = await response.json();
        setPackageDetails(data);


        if (data.reviewCount > 0) { 
          await fetchReviews(); 
        }
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
    <div className='package-details'>
      <h1 className='package-name'>{packageDetails.name}</h1>
      <p className='package-description'>{packageDetails.description}</p>
      <p className='package-price'>Price: {packageDetails.price}</p>
      <p className='package-duration'>Duration: {packageDetails.duration} days</p>
      <p className='package-location'>Location: {packageDetails.location}</p>
      <p className='package-highlights'>Highlights: {packageDetails.highlights}</p>

      {/* Display images */}
      {packageDetails.image && packageDetails.image.length > 0 ? (
        <div className='package-images'>
          {packageDetails.image.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000${img}`}
              alt={`Image of ${packageDetails.name}`}
              className='package-image'
            />
          ))}
        </div>
      ) : (
        <p>No images available for this package</p>
      )}

      {/* Display reviews */}
      <div className="reviews-section">
        <h2 className='reviews-title'>Reviews:</h2>
        {revvs && revvs.length > 0 ? (
          revvs.map((review) => (
            <div key={review._id} className="review-item">
              <p className='review-rating'><strong>Rating:</strong> {review.rating} / 5</p>
              <p className='review-comment'><strong>Comment:</strong> {review.comment}</p>
              <p className='review-author'><strong>Reviewed by:</strong> {review.customerName || 'Anonymous'}</p>
              {/* Report button */}
              <button
                className="report-button"
                onClick={() => handleReportReview(review._id)}
                title="Report this review"
              >
                <FaFlag className='report-icon' /> 
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
