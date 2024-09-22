import React, { useEffect, useState } from 'react';

const AgentHomePage = () => {
  const [bookedPackages, setBookedPackages] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookedPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/agent/booked-packages', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookedPackages(data);
        } else {
          console.error('Failed to fetch booked packages');
        }
      } catch (error) {
        console.error('Error fetching booked packages:', error);
      }
    };

    fetchBookedPackages();
  }, [token]);

  return (
    <div>
      <h1>Booked Packages</h1>
      {bookedPackages.length > 0 ? (
        <ul>
          {bookedPackages.map((pkg) => (
            <li key={pkg._id}>
              <h2>{pkg.name}</h2>
              <p>Description: {pkg.description}</p>
              <p>Price: {pkg.price}</p>
              <p>Duration: {pkg.duration} days</p>
              <h3>Reviews:</h3>
              {pkg.reviews && pkg.reviews.length > 0 ? (
                <ul>
                  {pkg.reviews.map((review) => (
                    <li key={review._id}>
                      <p>Rating: {review.rating}</p>
                      <p>Comment: {review.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reviews available for this package.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No packages booked.</p>
      )}
    </div>
  );
};

export default AgentHomePage;
