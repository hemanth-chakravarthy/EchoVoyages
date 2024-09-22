import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AgentHomePage = () => {
  const [bookedPackages, setPackages] = useState([]);
  const token = localStorage.getItem('token');
  const agentid = jwtDecode(localStorage.getItem('token')).id;
    useEffect(() => {
      const fetchPackages = async () => {
          try {
              const response = await fetch('http://localhost:5000/packages');
              const data = await response.json();
              if (data && data.data) {
                const agentPackages = data.data.filter(pkg => pkg.AgentID === agentid);
                console.log(agentid)
                console.log(agentPackages)
                  setPackages(agentPackages);
              } else {
                  console.error('No packages found in the response.');
              }
          } catch (error) {
              console.error('Failed to fetch packages:', error);
          }
      };

      fetchPackages();
  }, []);

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
      <Link to={`/createPackage`}>Create package</Link>
    </div>
  );
};

export default AgentHomePage;
