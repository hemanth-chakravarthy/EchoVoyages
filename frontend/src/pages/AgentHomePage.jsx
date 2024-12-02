import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AgentHomePage = () => {
  const [bookedPackages, setPackages] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const token = localStorage.getItem("token");
  const agentid = jwtDecode(token).id;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/packages");
        const data = await response.json();
        if (data && data.data) {
          const agentPackages = data.data.filter(
            (pkg) => pkg.AgentID === agentid
          );
          setPackages(agentPackages);
        } else {
          console.error("No packages found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/reviews");
        const data = await response.json();
        if (data) {
          setReviews(data);
        } else {
          console.error("No reviews found.");
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchPackages();
    fetchReviews();
  }, [agentid]);

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">EchoVoyages</a>
        </div>
        <div className="flex-none gap-2">
          <div className="flex space-x-4">
            <Link to="/AgentHome" className="btn btn-ghost">
              Home Page
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
      <h1 className="text-center font-bold text-4xl m-8">Listed Packages</h1>
      {bookedPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 ml-16 ">
          {bookedPackages.map((pkg) => (
            <div
              key={pkg._id}
              className="card card-compact bg-base-100 w-96 shadow-xl"
            >
              <figure>
                <img
                  src={
                    pkg.image && pkg.image.length > 0
                      ? `http://localhost:5000${pkg.image[0]}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={pkg.name}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{pkg.name}</h2>
                <p>{pkg.description}</p>
                <p>Price: Rs. {pkg.price}</p>
                <p>Duration: {pkg.duration} days</p>
                <div className="card-actions justify-end">
                  <Link to={`/packages/${pkg._id}`}>
                    <button className="btn btn-primary">View Package</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center font-medium text-xl m-8">
          No packages booked.
        </p>
      )}
    </div>
  );
};

export default AgentHomePage;
