import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      <div className="navbar bg-white shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-[#1a365d]">EchoVoyages</a>
        </div>
        <div className="flex-none gap-2">
          <div className="flex space-x-4">
            <Link to="/AgentHome" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              Home Page
            </Link>
            <Link to="/mylistings" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              My Listings
            </Link>
            <Link to="/createPackage" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              Create Package
            </Link>
            <Link to="/AgentProfilePage" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              Profile Page
            </Link>
          </div>
        </div>
      </div>

      <motion.main 
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center font-bold text-5xl mb-12 tracking-tight flex justify-center items-center gap-1">
          <span className="text-black">Booking</span>
          <span className="bg-gradient-to-r from-[#1a365d] to-[#00072D] text-transparent bg-clip-text">Re</span>
          <span className="text-black">quest</span>
        </h1>
        
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((req) => (
              <motion.div
                key={req._id}
                whileHover={{ 
                  y: -5, 
                  scale: 1.01,
                  boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                }}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">
                    {req.packageName}
                  </h2>
                  <p className="text-[#2d3748] mb-3">
                    <strong>Customer Name:</strong> {req.customerName}
                  </p>
                  <p className="text-[#2d3748] mb-3">
                    <strong>Status:</strong> {req.status}
                  </p>
                  <p className="text-[#2d3748] mb-3">
                    <strong>Request Date:</strong>{" "}
                    {new Date(req.date).toLocaleDateString()}
                  </p>
                  <p className="text-[#2d3748] mb-4">
                    <strong>Message:</strong> {req.message}
                  </p>
                  <div className="flex justify-end">
                    <Link to={`/requests/${req._id}`}>
                      <button className="bg-[#00072D] text-white font-bold py-3 px-6 rounded-full hover:bg-[#1a365d] transition-all duration-300 transform hover:scale-105">
                        View Request
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-[#2d3748]">
            No requests available for your packages.
          </p>
        )}
      </motion.main>
    </motion.div>
  );
};

export default AgentHomePage;
