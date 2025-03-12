import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

const AgentViewAll = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const agentId = decodedToken.id;

        const response = await fetch(
          `http://localhost:5000/packages/agents/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch packages");
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
    return (
      <p className="text-center text-xl text-gray-300">Loading packages...</p>
    );
  }

  if (error) {
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">EchoVoyages</a>
        </div>
        <div className="flex-none gap-2">
          <div className="flex space-x-4">
            <Link to="/AgentHome" className="btn btn-ghost">
              Home Page
            </Link>
            <Link to="/mylistings" className="btn btn-ghost">
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
      </div>
      <h1 className="text-center font-bold text-4xl m-8 text-white">
        Agent's Packages
      </h1>
      {packages.length === 0 ? (
        <p className="text-center text-xl text-gray-300">
          No packages found for this agent.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-opacity-20"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {pkg.name}
                </h2>
                <p className="text-gray-300 mb-4">Price: ${pkg.price}</p>
                <p className="text-gray-300 mb-4">Location: {pkg.location}</p>
                <p className="text-gray-300 mb-4">
                  Duration: {pkg.duration} days
                </p>
                <p className="text-gray-300 mb-4">Itinerary: {pkg.itinerary}</p>
                <button
                  className="w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
                  onClick={() => handleViewPackage(pkg._id)}
                >
                  View Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentViewAll;
