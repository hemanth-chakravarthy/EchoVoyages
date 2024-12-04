import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AgentHomePage = () => {
  const [requests, setRequests] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const token = localStorage.getItem("token");
  const agentid = jwtDecode(token).id;

  useEffect(() => {
    // Fetching requests for the logged-in agent
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/requests/agen/${agentid}`
        );
        const data = await response.json();
        if (data && data.data) {
          // Filter requests to only show those belonging to the logged-in agent
          const agentRequests = data.data;
          setRequests(agentRequests);
        } else {
          console.error("No requests found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
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

    fetchRequests();
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
      <h1 className="text-center font-bold text-4xl m-8">Booking Requests</h1>
      {requests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4">
          {requests.map((req) => (
            <div key={req._id} className="card bg-base-100 w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{req.packageName}</h2>
                <p>
                  <strong>Customer Name:</strong> {req.customerName}
                </p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>
                <p>
                  <strong>Request Date:</strong>{" "}
                  {new Date(req.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Message:</strong> {req.message}
                </p>
                <div className="card-actions justify-end">
                  <Link to={`/requests/${req._id}`}>
                    <button className="btn btn-primary">View Request</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No requests available for your packages.</p>
      )}
    </div>
  );
};

export default AgentHomePage;
