import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const GuideHome = () => {
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const guideId = jwtDecode(localStorage.getItem('token')).id;

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reviews/guides/${guideId}`); // Replace 'guideID' with the actual guide ID
        setGuide(response.data.guide);
        setReviews(response.data.review);
      } catch (error) {
        console.error('Error fetching guide data:', error);
      }
    };

    fetchGuideData();
  }, []);

  return (
    <div>
      <h1>Guide Home</h1>
      <div>
        <Link to={'/guideHome'}>Home Page</Link>
        <Link to={`/GuideProfilePage`}>Profile Page</Link>
      </div>

      {/* Check if reviews are available */}
      <h2>Reviews</h2>
      {reviews && reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <p><strong>{review.customerName}</strong>: {review.comment} (Rating: {review.rating})</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default GuideHome;
