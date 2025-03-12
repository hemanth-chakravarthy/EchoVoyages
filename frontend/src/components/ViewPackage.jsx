import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaFlag } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const ViewPackage = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setReviews] = useState([]);
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "agent") {
          setIsAgent(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/packages/${id}`);
        const data = await response.json();
        console.log("Fetched package details:", data);
        if (data && data.image) {
          data.image = data.image.map((img) =>
            img.startsWith("http") ? img : `http://localhost:5000${img}`
          );
        }
        setPackageDetails(data);

        if (data.reviewCount > 0) {
          await fetchReviews();
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reviews/package/${id}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
    fetchPackageDetails();
  }, [id]);

  const handleReportReview = async (reviewId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/reviews/${reviewId}`
      );
      if (response.status === 200) {
        alert("Review has been reported successfully!");
      } else {
        alert("Failed to report the review.");
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      alert("An error occurred while reporting the review.");
    }
  };

  if (!packageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#4169E1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
      {isAgent && (
        <nav className="bg-white border-b border-gray-100 shadow-sm relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-4">
                {[
                  { to: "/AgentHome", text: "Home" },
                  { to: "/mylistings", text: "My Listings" },
                  { to: "/createPackage", text: "Create Package" },
                  { to: "/AgentProfilePage", text: "Profile" }
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 rounded-full text-[#2d3748] hover:bg-[#4169E1]/10 hover:text-[#4169E1] transition-all duration-300"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8">
            <h1 className="text-5xl font-bold text-[#1a365d] tracking-tight mb-8">
              {packageDetails.name}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <motion.div className="space-y-4">
                {packageDetails.image && packageDetails.image.length > 0 ? (
                  <div className="grid gap-4">
                    {packageDetails.image.map((img, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="overflow-hidden rounded-lg shadow-md"
                      >
                        <img
                          src={img}
                          alt={`Image of ${packageDetails.name}`}
                          className="w-full h-auto object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 h-64 flex items-center justify-center rounded-lg">
                    <p className="text-[#2d3748]">No images available</p>
                  </div>
                )}
              </motion.div>

              <div className="space-y-6">
                <p className="text-[#2d3748] leading-relaxed">
                  {packageDetails.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{
                      y: -5,
                      scale: 1.01,
                      boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                    }}
                    className="bg-white rounded-lg shadow-lg p-4 border border-gray-100"
                  >
                    <p className="font-semibold text-[#1a365d]">Price</p>
                    <p className="text-2xl font-bold text-[#4169E1]">${packageDetails.price}</p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{
                      y: -5,
                      scale: 1.01,
                      boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                    }}
                    className="bg-white rounded-lg shadow-lg p-4 border border-gray-100"
                  >
                    <p className="font-semibold text-[#1a365d]">Duration</p>
                    <p className="text-[#2d3748]">{packageDetails.duration} days</p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{
                      y: -5,
                      scale: 1.01,
                      boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                    }}
                    className="bg-white rounded-lg shadow-lg p-4 border border-gray-100"
                  >
                    <p className="font-semibold text-[#1a365d]">Location</p>
                    <p className="text-[#2d3748]">{packageDetails.location}</p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{
                      y: -5,
                      scale: 1.01,
                      boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                    }}
                    className="bg-white rounded-lg shadow-lg p-4 border border-gray-100"
                  >
                    <p className="font-semibold text-[#1a365d]">Highlights</p>
                    <p className="text-[#2d3748]">{packageDetails.highlights}</p>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">Reviews</h2>
              {revvs && revvs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {revvs.map((review) => (
                    <motion.div
                      key={review._id}
                      whileHover={{
                        y: -5,
                        scale: 1.01,
                        boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                      }}
                      className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-[#1a365d]">
                            Rating: <span className="text-[#4169E1]">{review.rating}/5</span>
                          </p>
                          <p className="text-sm text-[#2d3748]">
                            By {review.customerName || "Anonymous"}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReportReview(review._id)}
                          className="text-[#2d3748] hover:text-[#4169E1] transition-colors"
                        >
                          <FaFlag />
                        </motion.button>
                      </div>
                      <p className="text-[#2d3748] leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-[#2d3748] italic">No reviews yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default ViewPackage;
