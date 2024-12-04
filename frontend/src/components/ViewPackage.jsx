import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaFlag } from "react-icons/fa";
import Navbar from "../components/Navbar";

const ViewPackage = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setRevDetails] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/packages/${id}`);
        const data = await response.json();
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
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchPackageDetails();
    fetchReviews();
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
      <div className="flex justify-center items-center h-screen bg-base-300">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-base-300 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-base-100 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-primary mb-6">
              {packageDetails.name}
            </h1>
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Images on the left */}
              <div className="lg:w-1/2">
                {packageDetails.image && packageDetails.image.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {packageDetails.image.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${img}`}
                        alt={`Image of ${packageDetails.name}`}
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-base-200 h-64 flex items-center justify-center rounded-lg">
                    <p className="text-base-content italic">
                      No images available for this package
                    </p>
                  </div>
                )}
              </div>

              {/* Details on the right */}
              <div className="lg:w-1/2 space-y-6">
                <p className="text-base-content">
                  {packageDetails.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="font-semibold text-primary">Price:</p>
                    <p className="text-base-content">{packageDetails.price}</p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="font-semibold text-primary">Duration:</p>
                    <p className="text-base-content">
                      {packageDetails.duration} days
                    </p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="font-semibold text-primary">Location:</p>
                    <p className="text-base-content">
                      {packageDetails.location}
                    </p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="font-semibold text-primary">Highlights:</p>
                    <p className="text-base-content">
                      {packageDetails.highlights}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews at the bottom */}
            <div className="bg-base-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-primary mb-4">Reviews:</h2>
              {revvs && revvs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revvs.map((review) => (
                    <div
                      key={review._id}
                      className="bg-base-200 p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-primary">
                            Rating:{" "}
                            <span className="text-base-content">
                              {review.rating} / 5
                            </span>
                          </p>
                          <p className="text-sm text-base-content/80">
                            Reviewed by: {review.customerName || "Anonymous"}
                          </p>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleReportReview(review._id)}
                          title="Report this review"
                        >
                          <FaFlag className="text-base-content/60 hover:text-primary" />
                        </button>
                      </div>
                      <p className="text-base-content">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content italic">
                  No reviews for this package yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage;
