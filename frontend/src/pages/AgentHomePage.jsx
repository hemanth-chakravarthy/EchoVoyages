import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AgentHomePage = () => {
  const [requests, setRequests] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const token = localStorage.getItem("token");
  const agentid = jwtDecode(token).id;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/requests/agen/${agentid}`
        );
        const data = await response.json();
        if (data && data.data) {
          setRequests(data.data);
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
      <h1 className="text-center font-bold text-4xl m-8 text-white">Booking Requests</h1>
      {requests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-opacity-20"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {req.packageName}
                </h2>
                <p className="text-gray-300 mb-4">
                  <strong>Customer Name:</strong> {req.customerName}
                </p>
                <p className="text-gray-300 mb-4">
                  <strong>Status:</strong> {req.status}
                </p>
                <p className="text-gray-300 mb-4">
                  <strong>Request Date:</strong>{" "}
                  {new Date(req.date).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-4">
                  <strong>Message:</strong> {req.message}
                </p>
                <div className="flex justify-end">
                  <Link to={`/requests/${req._id}`}>
                    <button className="w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient">
                      View Request
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-300">No requests available for your packages.</p>
      )}
    </div>
  );
};

export default AgentHomePage;
