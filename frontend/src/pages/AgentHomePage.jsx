import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 

const AgentHomePage = () => {
  const [bookedPackages, setPackages] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const token = localStorage.getItem('token');
  const agentid = jwtDecode(token).id; 

 
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/packages');
        const data = await response.json();
        if (data && data.data) {
          const agentPackages = data.data.filter(pkg => pkg.AgentID === agentid);
          setPackages(agentPackages); 
        } else {
          console.error('No packages found in the response.');
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    };

    
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/reviews');
        const data = await response.json(); 
        if (data) {
          setReviews(data); 
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
      <h1>Listed Packages</h1>
      {bookedPackages.length > 0 ? (
        <ul>
          {bookedPackages.map((pkg) => (
            <li key={pkg._id}>
              <h2>{pkg.name}</h2>
              <p>Description: {pkg.description}</p>
              <p>Price: {pkg.price}</p>
              <p>Duration: {pkg.duration} days</p>
              <Link to={`/packages/${pkg._id}`}><button>View Package</button></Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No packages booked.</p>
      )}
      <Link to={'/AgentHome'}>Home Page</Link>
      <Link to={`/createPackage`}>Create package</Link>
      <Link to={`/AgentProfilePage`}>Profile Page</Link>
    </div>
  );
};

export default AgentHomePage;
