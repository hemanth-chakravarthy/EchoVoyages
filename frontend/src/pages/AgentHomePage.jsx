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
        const response = await fetch(`http://localhost:5000/requests/agen/${agentid}`);
        const data = await response.json();
        if (data && data.data) {
          // Filter requests to only show those belonging to the logged-in agent
          const agentRequests = data.data
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
      <nav className="navbarr">
        <ul className="nav-linkss">
          <li>
            <Link to="/AgentHome">Home Page</Link>
          </li>
          <li>
            <Link to="/createPackage">Create Package</Link>
          </li>
          <li>
            <Link to="/AgentProfilePage">Profile Page</Link>
          </li>
        </ul>
      </nav>
      
      <h1>Requests for Your Packages</h1>
      
      {requests.length > 0 ? (
        <ul>
          {requests.map((req) => (
            <li key={req._id} className="mb-4 p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{req.packageName}</h2>
              <p><strong>Customer Name:</strong> {req.customerName}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Request Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
              <p><strong>Message:</strong> {req.message}</p>
              <Link to={`/requests/${req._id}`}>
                <button className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  View Request
                </button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No requests available for your packages.</p>
      )}
    </div>
  );
};

export default AgentHomePage;
