import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Fixed the import statement

const AgentHomePage = () => {
  const [bookedPackages, setPackages] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const token = localStorage.getItem('token');
  const agentid = jwtDecode(token).id; // Decode the token to get the agent ID

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/packages');
        const data = await response.json();
        if (data && data.data) {
          const agentPackages = data.data.filter(pkg => pkg.AgentID === agentid);
          setPackages(agentPackages); // Store the packages for this agent
        } else {
          console.error('No packages found in the response.');
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    };

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/reviews');
        const data = await response.json(); // Parse the response as JSON
        if (data) {
          setReviews(data); // Set the reviews in state
        } else {
          console.error('No reviews found.');
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchPackages();
    fetchReviews();
  }, [agentid]);

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
              {/* <h3>Reviews:</h3> */}
              {/* Filter reviews by packageId */}
              {/* {allRevs.length > 0 ? (
                <ul>
                  {allRevs
                    .filter((review) => review.packageId === pkg._id) // Match reviews to package
                    .map((review) => (
                      <li key={review._id}>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.comment}</p>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No reviews available for this package.</p>
              )} */}
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
