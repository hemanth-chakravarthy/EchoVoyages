import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerPackActions = () => {
  const { id } = useParams(); // `id` is the packageId
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("book");
  const [showReviewModal, setShowReviewModal] = useState(false); // Modal visibility state
  const [rating, setRating] = useState(1); // Default rating value
  const [comment, setComment] = useState(""); // Comment value
  const [bookingId, setBookingId] = useState(""); // State for booking ID
  const guideId = ""; // Guide ID, can be empty or used as needed
  const [customDetails, setCustomDetails] = useState({
    price: 0,
    duration: 0,
    itinerary: "",
    availableDates: [],
    maxGroupSize: 1,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const customerId = jwtDecode(token).id;

  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!showRequestModal) return; // Fetch only when modal is shown
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const packageData = await response.json();
          setCustomDetails({
            price: packageData.price || 0,
            duration: packageData.duration || 0,
            itinerary: packageData.itinerary || "",
            availableDates: packageData.availableDates || [],
            maxGroupSize: packageData.maxGroupSize || 1,
          });
        } else {
          console.error("Failed to fetch package details.");
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetails();
  }, [showRequestModal, id, token]);

  const handleRequestSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          packageId: id,
          requestType,
          ...customDetails,
          message,
        }),
      });
      if (response.ok) {
        toast.success(`Request submitted successfully as ${requestType}.`);
        setShowRequestModal(false);
        navigate("/home");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("An error occurred while submitting the request.");
    }
  };

  const handleCustomDetailsChange = (key, value) => {
    setCustomDetails((prev) => ({ ...prev, [key]: value }));
  };
  // Handle opening the review modal
  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  // Handle closing the review modal
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(1); // Reset rating
    setComment(""); // Reset comment
    setBookingId(""); // Reset booking ID
  };

  // Function to submit the review
  const handleSubmitReview = async () => {
    if (!bookingId) {
      toast.error("Please enter the Booking ID.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Use the package ID from the URL params
          rating, // Rating value from the form
          comment, // Comment from the form
          bookingId, // Include the booking ID
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Review submitted:", result);
        toast.success("Review submitted successfully!");
        handleCloseReviewModal(); // Close the modal
      } else {
        const errorData = await response.json();
        console.error("Failed to submit review:", errorData.message);
        toast.error(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  // Handle adding to wishlis
  const addToWishlist = async () => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customerId, // Logged-in user's customerId
          packageId: id, // Current package ID from URL params
        }),
      });

      if (response.ok) {
        toast.success("Package added to wishlist successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add to wishlist: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("An error occurred while adding to the wishlist.");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <button
        className="btn btn-primary"
        onClick={() => setShowRequestModal(true)}
      >
        Customize / Book
      </button>
      <button
        onClick={handleOpenReviewModal}
        className="btn btn-secondary ml-2"
      >
        Add Review
      </button>
      <button onClick={addToWishlist} className="btn btn-accent ml-2">
        Add to Wishlist
      </button>

      {showRequestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-300 bg-opacity-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-base-content">
              {requestType === "book" ? "Book Package" : "Customize Package"}
            </h2>
            {isLoading ? (
              <p className="text-base-content">Loading package details...</p>
            ) : (
              <>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Request Type:</span>
                  </label>
                  <select
                    name="requestType"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="book">Book</option>
                    <option value="customize">Customize</option>
                  </select>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Price:</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={customDetails.price}
                    onChange={(e) =>
                      handleCustomDetailsChange("price", e.target.value)
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Duration (days):</span>
                  </label>
                  <input
                    name="duration"
                    type="number"
                    value={customDetails.duration}
                    onChange={(e) =>
                      handleCustomDetailsChange(
                        "duration",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Itinerary:</span>
                  </label>
                  <textarea
                    name="itinerary"
                    value={customDetails.itinerary}
                    onChange={(e) =>
                      handleCustomDetailsChange("itinerary", e.target.value)
                    }
                    className="textarea textarea-bordered w-full"
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">
                      Available Dates (comma-separated):
                    </span>
                  </label>
                  <input
                    name="availableDates"
                    type="text"
                    onChange={(e) =>
                      handleCustomDetailsChange(
                        "availableDates",
                        e.target.value
                          .split(",")
                          .map((date) => new Date(date.trim()))
                      )
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Max Group Size:</span>
                  </label>
                  <input
                    name="maxGroupSize"
                    type="number"
                    value={customDetails.maxGroupSize}
                    onChange={(e) =>
                      handleCustomDetailsChange(
                        "maxGroupSize",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4">
              <button
                name="submit"
                onClick={handleRequestSubmit}
                className="btn btn-primary"
              >
                Submit
              </button>
              <button
                name="cancel"
                onClick={() => setShowRequestModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-base-300 bg-opacity-50 z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-base-content">
              Rate and Review
            </h2>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Booking ID:</span>
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Rating (1 to 5):</span>
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Comment:</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button onClick={handleSubmitReview} className="btn btn-primary">
                Submit
              </button>
              <button
                onClick={handleCloseReviewModal}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerPackActions;
