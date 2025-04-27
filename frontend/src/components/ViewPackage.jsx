import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaFlag } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPackage = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setReviews] = useState([]);
  const [isAgent, setIsAgent] = useState(false);
  const [reportedReviews, setReportedReviews] = useState({}); // State to track reported reviews

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
    if (reportedReviews[reviewId]) {
      toast.info("This review has already been reported.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/reviews/${reviewId}`
      );
      if (response.status === 200) {
        toast.success("Review has been reported successfully!");
        setReportedReviews((prev) => ({ ...prev, [reviewId]: true }));
      } else {
        toast.error("Failed to report the review.");
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error("An error occurred while reporting the review.");
    }
  };

  if (!packageDetails) {
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
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin"></div>
        </div>
      </motion.div>
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
      <Navbar />
      {isAgent && (
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="container mx-auto px-4 py-4"
        >
          <div className="flex gap-4">
            {["Home Page", "My Listings", "Create Package", "Profile Page"].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={["/AgentHome", "/mylistings", "/createPackage", "/AgentProfilePage"][index]}
                  className="bg-[#00072D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      <motion.main
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-5xl font-bold text-[#1a365d] tracking-tight">
              {packageDetails.name}
            </h1>

            <div className="flex items-center mt-4 md:mt-0">
              <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-yellow-700 font-bold mr-1">
                  {packageDetails.reviews && packageDetails.reviews.length > 0
                    ? (packageDetails.reviews.reduce((sum, review) => sum + review.rating, 0) / packageDetails.reviews.length).toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-yellow-700">★</span>
                <span className="text-gray-600 ml-2 text-sm">
                  ({packageDetails.reviews ? packageDetails.reviews.length : 0} {packageDetails.reviews && packageDetails.reviews.length === 1 ? "rating" : "ratings"})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-1/2">
              {packageDetails.image && packageDetails.image.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {packageDetails.image.map((img, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="overflow-hidden rounded-lg shadow-lg"
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
                  <p className="text-[#2d3748] italic">No images available</p>
                </div>
              )}
            </div>

            <div className="lg:w-1/2 space-y-6">
              <p className="text-[#2d3748] leading-relaxed">
                {packageDetails.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Price", value: `₹${packageDetails.price}` },
                  { label: "Duration", value: `${packageDetails.duration} days` },
                  { label: "Location", value: packageDetails.location },
                  { label: "Highlights", value: packageDetails.highlights }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <p className="font-semibold text-[#1a365d] mb-1">{item.label}</p>
                    <p className="text-[#2d3748]">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight">Reviews</h2>

              <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
                <div className="flex flex-col items-center mr-4">
                  <span className="text-3xl font-bold text-yellow-700">
                    {revvs && revvs.length > 0
                      ? (revvs.reduce((sum, review) => sum + review.rating, 0) / revvs.length).toFixed(1)
                      : "0.0"}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-500">★</span>
                    ))}
                  </div>
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">{revvs ? revvs.length : 0}</span> {revvs && revvs.length === 1 ? "rating" : "ratings"}
                </div>
              </div>
            </div>

            {revvs && revvs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {revvs.map((review) => (
                  <motion.div
                    key={review._id}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                    }}
                    className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>
                                {star <= review.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[#2d3748]">
                          By {review.customerName || "Anonymous"}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReportReview(review._id)}
                        className={`text-red-500 hover:text-red-600 transition-colors ${reportedReviews[review._id] ? "cursor-not-allowed" : ""}`}
                        title={reportedReviews[review._id] ? "Already reported" : "Report this review"}
                      >
                        <FaFlag />
                      </motion.button>
                    </div>
                    <p className="text-[#2d3748] leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#2d3748] text-lg">
                No reviews for this package yet.
              </p>
            )}
          </motion.div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default ViewPackage;
