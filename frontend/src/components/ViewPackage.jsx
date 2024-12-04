import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaFlag, FaStar } from "react-icons/fa";
import PropTypes from 'prop-types';
import Navbar from "./Navbar";

const ViewPackage = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/packages/${id}`);
        const data = await response.json();
        console.log('Fetched package details:', data);
        if (data && data.image) {
          // Ensure image URLs are complete
          data.image = data.image.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`);
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

    fetchPackageDetails();
  }, [id]);

  const handleReportReview = async (reviewId) => {
    try {
      const response = await axios.post(`http://localhost:5000/reviews/${reviewId}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-white mb-4">{packageDetails.name}</h1>
            <p className="text-gray-300 mb-6">{packageDetails.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-white">
                  <span className="font-semibold">Price:</span> ${packageDetails.price}
                </p>
                <p className="text-white">
                  <span className="font-semibold">Duration:</span> {packageDetails.duration} days
                </p>
              </div>
              <div>
                <p className="text-white">
                  <span className="font-semibold">Location:</span> {packageDetails.location}
                </p>
                <p className="text-white">
                  <span className="font-semibold">Highlights:</span> {packageDetails.highlights}
                </p>
              </div>
            </div>

            {packageDetails.image && packageDetails.image.length > 0 ? (
              <div className="relative pb-2/3 mb-8">
                <div className="absolute inset-0 flex overflow-x-auto snap-x">
                  {packageDetails.image.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Image of ${packageDetails.name}`}
                      className="h-64 w-full object-cover snap-center"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-300 mb-8">No images available for this package</p>
            )}

            <div className="reviews-section">
              <h2 className="text-2xl font-semibold text-white mb-4">Reviews:</h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white bg-opacity-5 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-400"} />
                          ))}
                        </div>
                        <p className="text-white">{review.rating} / 5</p>
                      </div>
                      <p className="text-gray-300 mb-2">{review.comment}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">
                          Reviewed by: {review.customerName || "Anonymous"}
                        </p>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                          onClick={() => handleReportReview(review._id)}
                          title="Report this review"
                        >
                          <FaFlag />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No reviews for this package yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

ViewPackage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ViewPackage;

