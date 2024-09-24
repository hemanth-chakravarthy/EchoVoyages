import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        const res = await fetch(`http://localhost:5000/reviews/${id}`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
    fetchPackageDetails();
  }, [id]);

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
