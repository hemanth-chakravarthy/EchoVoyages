/** @format */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaFlag,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaListUl,
  FaRoute,
  FaArrowLeft,
  FaImage,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPackage = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setReviews] = useState([]);
  const [isAgent, setIsAgent] = useState(false);
  const [reportedReviews, setReportedReviews] = useState({}); // State to track reported reviews
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "agency") {
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
        setLoading(true);
        const response = await fetch(`${apiUrl}/packages/${id}`);
        const data = await response.json();
        console.log("Fetched package details:", data);
        if (data && data.image) {
          data.image = data.image.map((img) =>
            img.startsWith("http") ? img : `${apiUrl}${img}`
          );
        }
        setPackageDetails(data);
        if (data.reviewCount > 0) {
          await fetchReviews();
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/reviews/package/${id}`);
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
    // Check if toast is available before using it
    if (!toast || typeof toast.info !== "function") {
      console.error("Toast functionality is not available");
      return;
    }

    if (reportedReviews[reviewId]) {
      toast.info("This review has already been reported.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/reviews/${reviewId}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="text-[#0a66c2] text-4xl animate-spin mb-4" />
          <p className="text-[#38434f] font-medium">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
          <FaInfoCircle className="text-[#b24020] text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#38434f] mb-4">
            Package Not Found
          </h2>
          <p className="text-[#56687a] mb-6">
            The package you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/packages"
            className="bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors"
          >
            <FaArrowLeft className="inline mr-2" /> Browse Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/packages"
            className="inline-flex items-center text-[#0a66c2] hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Packages
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Package Header */}
          <div className="relative">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/travel-banner.png"
                alt="Travel Agency Banner"
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a66c2]/40 to-[#004182]/40"></div>
            </div>

            <div className="absolute bottom-4 left-8">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-[#38434f]">
                  {packageDetails.name}
                </h1>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-[#e7a33e]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <=
                          Math.round(
                            packageDetails.reviews &&
                              packageDetails.reviews.length > 0
                              ? packageDetails.reviews.reduce(
                                  (sum, review) => sum + review.rating,
                                  0
                                ) / packageDetails.reviews.length
                              : 0
                          )
                            ? "text-[#e7a33e]"
                            : "text-[#e9e5df]"
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[#56687a]">
                    {packageDetails.reviews && packageDetails.reviews.length > 0
                      ? (
                          packageDetails.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / packageDetails.reviews.length
                        ).toFixed(1)
                      : "0.0"}{" "}
                    (
                    {packageDetails.reviews ? packageDetails.reviews.length : 0}{" "}
                    {packageDetails.reviews &&
                    packageDetails.reviews.length === 1
                      ? "rating"
                      : "ratings"}
                    )
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Details */}
              <div className="lg:w-2/3">
                {/* Package Description */}
                <div className="bg-[#f3f6f8] p-6 rounded-lg mb-6">
                  <h2 className="text-xl font-semibold text-[#38434f] mb-4 flex items-center">
                    <FaInfoCircle className="text-[#0a66c2] mr-2" /> About This
                    Package
                  </h2>
                  <p className="text-[#38434f] leading-relaxed">
                    {packageDetails.description}
                  </p>
                </div>

                {/* Package Itinerary */}
                <div className="bg-white border border-[#dce6f1] rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-[#38434f] mb-4 flex items-center">
                    <FaRoute className="text-[#0a66c2] mr-2" /> Itinerary
                  </h2>
                  {packageDetails.itinerary ? (
                    <div className="text-[#38434f] leading-relaxed whitespace-pre-line">
                      {packageDetails.itinerary}
                    </div>
                  ) : (
                    <p className="text-[#56687a] italic">
                      Detailed itinerary not available for this package.
                    </p>
                  )}
                </div>

                {/* Package Gallery */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#38434f] mb-4 flex items-center">
                    <FaImage className="text-[#0a66c2] mr-2" /> Gallery
                  </h2>

                  {packageDetails.image && packageDetails.image.length > 0 ? (
                    <div>
                      <div className="h-80 rounded-lg overflow-hidden mb-2">
                        <img
                          src={packageDetails.image[activeImageIndex]}
                          alt={`${packageDetails.name} - featured`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {packageDetails.image.map((img, index) => (
                          <div
                            key={index}
                            className={`h-20 rounded-lg overflow-hidden cursor-pointer ${index === activeImageIndex ? "ring-2 ring-[#0a66c2]" : "opacity-70"}`}
                            onClick={() => setActiveImageIndex(index)}
                          >
                            <img
                              src={img}
                              alt={`${packageDetails.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-60 bg-[#e9e5df] rounded-lg flex items-center justify-center">
                      <p className="text-[#56687a] flex items-center">
                        <FaImage className="mr-2" /> No images available
                      </p>
                    </div>
                  )}
                </div>

                {/* Reviews Section */}
                <div className="border-t border-[#e9e5df] pt-6 mt-6">
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#38434f]">
                      Reviews
                    </h2>
                    <div className="ml-4 flex items-center">
                      <div className="flex items-center text-[#e7a33e] mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={
                              star <=
                              Math.round(
                                revvs && revvs.length > 0
                                  ? revvs.reduce(
                                      (sum, review) => sum + review.rating,
                                      0
                                    ) / revvs.length
                                  : 0
                              )
                                ? "text-[#e7a33e]"
                                : "text-[#e9e5df]"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[#56687a]">
                        {revvs && revvs.length > 0
                          ? (
                              revvs.reduce(
                                (sum, review) => sum + review.rating,
                                0
                              ) / revvs.length
                            ).toFixed(1)
                          : "0.0"}{" "}
                        ({revvs ? revvs.length : 0}{" "}
                        {revvs && revvs.length === 1 ? "rating" : "ratings"})
                      </span>
                    </div>
                  </div>

                  {revvs && revvs.length > 0 ? (
                    <div className="space-y-4">
                      {revvs.map((review) => (
                        <motion.div
                          key={review._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#f3f6f8] rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center text-[#e7a33e] mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={
                                      star <= review.rating
                                        ? "text-[#e7a33e]"
                                        : "text-[#e9e5df]"
                                    }
                                  />
                                ))}
                                <span className="ml-2 text-[#56687a]">
                                  {review.rating} / 5
                                </span>
                              </div>
                              <p className="text-[#56687a] text-sm">
                                By {review.customerName || "Anonymous"}
                              </p>
                            </div>
                            {isAgent && (
                              <button
                                onClick={() => handleReportReview(review._id)}
                                className={`text-[#56687a] hover:text-[#b24020] transition-colors ${reportedReviews[review._id] ? "cursor-not-allowed" : ""}`}
                                title={
                                  reportedReviews[review._id]
                                    ? "Already reported"
                                    : "Report this review"
                                }
                                disabled={reportedReviews[review._id]}
                              >
                                <FaFlag />
                              </button>
                            )}
                          </div>
                          <p className="text-[#38434f] mt-2">
                            {review.comment}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#f3f6f8] rounded-lg p-6 text-center">
                      <p className="text-[#56687a]">
                        No reviews for this package yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Package Info Card */}
              <div className="lg:w-1/3">
                <div className="bg-white border border-[#dce6f1] rounded-lg shadow-sm sticky top-6">
                  <div className="p-6 border-b border-[#e9e5df]">
                    <h3 className="text-xl font-semibold text-[#38434f] mb-4">
                      Package Details
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FaDollarSign className="text-[#0a66c2] mt-1 mr-3 w-5" />
                        <div>
                          <p className="text-[#56687a] text-sm">Price</p>
                          <p className="text-[#38434f] font-bold text-xl">
                            ₹{packageDetails.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaCalendarAlt className="text-[#0a66c2] mt-1 mr-3 w-5" />
                        <div>
                          <p className="text-[#56687a] text-sm">Duration</p>
                          <p className="text-[#38434f]">
                            {packageDetails.duration} days
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-[#0a66c2] mt-1 mr-3 w-5" />
                        <div>
                          <p className="text-[#56687a] text-sm">Location</p>
                          <p className="text-[#38434f]">
                            {packageDetails.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaListUl className="text-[#0a66c2] mt-1 mr-3 w-5" />
                        <div>
                          <p className="text-[#56687a] text-sm">Highlights</p>
                          <p className="text-[#38434f]">
                            {packageDetails.highlights}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <button className="w-full bg-[#0a66c2] text-white py-3 rounded font-medium hover:bg-[#004182] transition-colors">
                      Book This Package
                    </button>

                    <button className="w-full mt-3 bg-[#f3f6f8] text-[#0a66c2] py-3 rounded font-medium hover:bg-[#dce6f1] transition-colors">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ViewPackage;
