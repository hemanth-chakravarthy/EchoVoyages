import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

const AgentViewAll = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Get the agent's ID from the token
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const agentId = decodedToken.id; // Ensure this matches the field for AgentID

        // Fetch packages for the logged-in agent
        const response = await fetch(`http://localhost:5000/packages/agents/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization header if required
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch packages');
        }

        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  if (isLoading) {
    return <p>Loading packages...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex-none gap-2">
        <div className="flex space-x-4">
          <Link to="/AgentHome" className="btn btn-ghost">
            Home Page
          </Link>
          <Link to="/agentViewAll" className="btn btn-ghost">
            My Listings
          </Link>
          <Link to="/createPackage" className="btn btn-ghost">
            Create Package
          </Link>
          <Link to="/AgentProfilePage" className="btn btn-ghost">
            Profile Page
          </Link>
        </div>
      </div>
      <h1>Agent's Packages</h1>
      {packages.length === 0 ? (
        <p>No packages found for this agent.</p>
      ) : (
        <ul>
          {packages.map((pkg) => (
            <li key={pkg._id} className="border p-4 mb-4">
              <h2>{pkg.name}</h2>
              <p>Price: ${pkg.price}</p>
              <p>Location: {pkg.location}</p>
              <p>Duration: {pkg.duration} days</p>
              <p>Itinerary: {pkg.itinerary}</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => handleViewPackage(pkg._id)}
              >
                View Package
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentViewAll;
