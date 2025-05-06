/** @format */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  FaEdit,
  FaTrash,
  FaHeart,
  FaUser,
  FaCheck,
  FaTimes,
  FaPaperPlane,
  FaExclamationTriangle,
  FaBriefcase,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

const ViewPage = () => {
  // Common states
  const { id: packageId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setReviews] = useState([]);
  const [reportedReviews, setReportedReviews] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Customer-specific states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("book");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [customerBookings, setCustomerBookings] = useState([]);
  const [customDetails, setCustomDetails] = useState({
    price: 0,
    duration: 0,
    itinerary: "",
    availableDates: [],
    maxGroupSize: 1,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState("");

  // Agent-specific states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPackage, setEditedPackage] = useState({
    name: "",
    price: "",
    description: "",
    isActive: "pending",
  });

  // Guide-specific states
  const [showGuideRequestModal, setShowGuideRequestModal] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [guideRequests, setGuideRequests] = useState([]);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  // Determine user role
  useEffect(() => {
    const determineUserRole = async () => {
      if (!token) {
        console.log("No token found, setting role to guest");
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Check the user type from the token
        const userRole = decoded.userType || decoded.role;
        if (userRole) {
          console.log("User type/role from token:", userRole);

          if (userRole === "customer") {
            setRole("customer");
          } else if (userRole === "guide") {
            setRole("guide");
          } else if (userRole === "agency" || userRole === "agent") {
            setRole("agency");
          } else {
            setRole("guest");
          }
        } else {
          // If role not in token, determine from API
          await fetchUserRoleFromAPI(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRoleFromAPI = async (userId) => {
      if (!userId) {
        setRole("guest");
        return;
      }

      try {
        // Try to fetch customer data
        try {
          const customerResponse = await axios.get(
            `${apiUrl}/customers/${userId}`
          );
          if (customerResponse.data) {
            setRole("customer");
            return;
          }
        } catch (customerError) {
          console.log("Not a customer:", customerError.message);
        }

        // Try to fetch guide data
        try {
          const guideResponse = await axios.get(`${apiUrl}/guides/${userId}`);
          if (guideResponse.data) {
            setRole("guide");
            return;
          }
        } catch (guideError) {
          console.log("Not a guide:", guideError.message);
        }

        // Try to fetch agency data
        try {
          const agencyResponse = await axios.get(`${apiUrl}/agency/${userId}`);
          if (agencyResponse.data) {
            setRole("agency");
            return;
          }
        } catch (agencyError) {
          console.log("Not an agency:", agencyError.message);
        }

        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    determineUserRole();
  }, [token]);

  // Fetch package details and reviews
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/packages/${packageId}`);
        const data = response.data;

        if (data && data.image) {
          data.image = data.image.map((img) =>
            img.startsWith("http") ? img : `${apiUrl}${img}`
          );
        }

        setPackageDetails(data);
        setEditedPackage({
          name: data.name || "",
          price: data.price || "",
          description: data.description || "",
          isActive: data.isActive || "pending",
        });

        // Set custom details for customer actions
        setCustomDetails({
          price: data.price || 0,
          duration: data.duration || 0,
          itinerary: data.itinerary || "",
          availableDates: data.availableDates || [],
          maxGroupSize: data.maxGroupSize || 1,
        });

        // Fetch reviews if needed
        await fetchReviews();
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/reviews/package/${packageId}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchPackageDetails();
  }, [packageId, refreshTrigger]);

  // Fetch customer-specific data
  useEffect(() => {
    if (role === "customer" && userId && showReviewModal) {
      const fetchCustomerBookings = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/bookings/cust/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Filter bookings for this package
          const packageBookings = response.data.filter(
            (booking) => booking.packageId === packageId
          );

          setCustomerBookings(packageBookings);
        } catch (error) {
          console.error("Error fetching customer bookings:", error);
        }
      };

      fetchCustomerBookings();
    }
  }, [role, userId, packageId, showReviewModal, token]);

  // Fetch guide-specific data
  useEffect(() => {
    if (role === "guide" && userId) {
      const fetchGuideData = async () => {
        try {
          // Check if guide is already assigned to this package
          if (packageDetails && packageDetails.guides) {
            const isAssigned = packageDetails.guides.some(
              (g) => g._id === userId || g === userId
            );

            if (isAssigned) {
              toast.info("You are already assigned to this package");
            }
          }

          // Check for existing requests
          const requestsResponse = await axios.get(`${apiUrl}/guide-requests`, {
            params: {
              guideId: userId,
              packageId,
              type: "package_assignment",
              initiator: "guide",
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (
            requestsResponse.data.data &&
            requestsResponse.data.data.length > 0
          ) {
            setExistingRequest(requestsResponse.data.data[0]);
          }
        } catch (error) {
          console.error("Error fetching guide data:", error);
        }
      };

      fetchGuideData();
    }
  }, [role, userId, packageId, packageDetails, token]);

  // Fetch agency-specific data
  useEffect(() => {
    if (role === "agency" && packageId) {
      const fetchGuideRequests = async () => {
        try {
          const params = {
            packageId,
            agencyId: userId,
            type: "package_assignment",
            initiator: "guide",
          };

          const response = await axios.get(`${apiUrl}/guide-requests`, {
            params,
            headers: { Authorization: `Bearer ${token}` },
          });

          setGuideRequests(response.data.data || []);
        } catch (err) {
          console.error("Error fetching guide requests:", err);
        }
      };

      fetchGuideRequests();
    }
  }, [role, packageId, userId, token, refreshTrigger]);

  // CUSTOMER ACTIONS
  const handleCustomerRequestSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: userId,
          packageId,
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

  const handleSubmitReview = async () => {
    if (!bookingId) {
      toast.error("Please select a booking.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: userId,
          packageId,
          rating,
          comment,
          bookingId,
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setShowReviewModal(false);
        setRating(1);
        setComment("");
        setBookingId("");
        setRefreshTrigger((prev) => prev + 1);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  const addToWishlist = async () => {
    try {
      const response = await fetch(`${apiUrl}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: userId,
          packageId,
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

  // AGENT ACTIONS
  const handleUpdatePackage = async () => {
    try {
      const updatedData = {
        name: editedPackage.name,
        price: editedPackage.price,
        description: editedPackage.description,
        isActive: editedPackage.isActive,
      };

      const response = await axios.put(
        `${apiUrl}/packages/${packageId}`,
        updatedData
      );

      toast.success(response.data.message || "Package updated successfully");
      setShowEditModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error("Error updating the package");
      console.error(error);
    }
  };

  const handleDeletePackage = async () => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        const response = await axios.delete(`${apiUrl}/packages/${packageId}`);

        toast.success(response.data.message || "Package deleted successfully");
        navigate("/packages");
      } catch (error) {
        toast.error("Error deleting the package");
        console.error(error);
      }
    }
  };

  // GUIDE ACTIONS
  const handleSendGuideRequest = async () => {
    if (!userId || !packageId) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/guide-requests/guide-to-package`,
        {
          guideId: userId,
          packageId,
          message: message || "I am interested in guiding this package",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Request sent successfully!");
        setShowGuideRequestModal(false);
        setExistingRequest(response.data.data);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send request";
      toast.error(errorMessage);
    }
  };

  const handleCancelGuideRequest = async () => {
    if (!existingRequest?._id) {
      toast.error("No request to cancel");
      return;
    }

    try {
      await axios.delete(`${apiUrl}/guide-requests/${existingRequest._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Request cancelled successfully");
      setExistingRequest(null);
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Failed to cancel request");
    }
  };

  // AGENCY ACTIONS FOR GUIDE REQUESTS
  const handleGuideRequestStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.put(
        `${apiUrl}/guide-requests/${requestId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state
      setGuideRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );

      toast.success(`Request ${newStatus} successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(`Error ${newStatus} guide request:`, err);
      toast.error(`Failed to ${newStatus} request`);
    }
  };

  // COMMON ACTIONS
  const handleReportReview = async (reviewId) => {
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
          <FaExclamationTriangle className="text-[#b24020] text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#38434f] mb-4">
            Package Not Found
          </h2>
          <p className="text-[#56687a] mb-6">
            The package you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/home"
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
            to="/home"
            className="inline-flex items-center text-[#0a66c2] hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Packages
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Package Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Details */}
              <div className="lg:w-2/3">
                {/* Package Gallery */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#38434f] mb-4 flex items-center">
                    <FaImage className="text-[#0a66c2] mr-2" /> Gallery
                  </h2>

                  {packageDetails.image && packageDetails.image.length > 0 ? (
                    <div>
                      <div className="h-82 rounded-lg overflow-hidden mb-2">
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

                {/* Guide Requests Section (For Agency Only) */}
                {role === "agency" && (
                  <div className="border-t border-[#e9e5df] pt-6 mt-6">
                    <h2 className="text-xl font-semibold text-[#38434f] mb-4 flex items-center">
                      <FaBriefcase className="text-[#0a66c2] mr-2" /> Guide
                      Requests
                    </h2>

                    {guideRequests && guideRequests.length > 0 ? (
                      <div className="space-y-4">
                        {guideRequests.map((request) => (
                          <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#f3f6f8] rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-[#38434f]">
                                  Guide: {request.guideName || "Unknown Guide"}
                                </h3>
                                <p className="text-[#56687a] text-sm">
                                  Package:{" "}
                                  {request.packageName || "Unknown Package"}
                                </p>
                                <p className="text-[#38434f] mt-2">
                                  {request.message}
                                </p>
                                <p className="text-[#56687a] text-xs mt-1">
                                  Requested on:{" "}
                                  {new Date(
                                    request.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              {request.status === "pending" && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleGuideRequestStatusUpdate(
                                        request._id,
                                        "approved"
                                      )
                                    }
                                    className="bg-[#44712e] text-white p-2 rounded hover:bg-[#365d25] transition-colors"
                                    title="Approve"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleGuideRequestStatusUpdate(
                                        request._id,
                                        "rejected"
                                      )
                                    }
                                    className="bg-[#b24020] text-white p-2 rounded hover:bg-[#8e331a] transition-colors"
                                    title="Reject"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              )}

                              {request.status !== "pending" && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    request.status === "approved"
                                      ? "bg-[#eaf5ea] text-[#44712e]"
                                      : "bg-[#f5e9e5] text-[#b24020]"
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#f3f6f8] rounded-lg p-6 text-center">
                        <p className="text-[#56687a]">
                          No guide requests for this package.
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                            {role === "agency" && (
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

              {/* Right Column - Package Info Card & Actions */}
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

                  {/* Role-based Action Buttons */}
                  <div className="p-6 space-y-3">
                    {/* Customer Actions */}
                    {role === "customer" && (
                      <>
                        <button
                          onClick={() => setShowRequestModal(true)}
                          className="w-full bg-[#0a66c2] text-white py-3 rounded font-medium hover:bg-[#004182] transition-colors flex items-center justify-center"
                        >
                          <FaCalendarAlt className="mr-2" /> Customize / Book
                        </button>

                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="w-full bg-[#f3f6f8] text-[#0a66c2] py-3 rounded font-medium hover:bg-[#dce6f1] transition-colors flex items-center justify-center"
                        >
                          <FaStar className="mr-2" /> Add Review
                        </button>

                        <button
                          onClick={addToWishlist}
                          className="w-full bg-[#f3f6f8] text-[#0a66c2] py-3 rounded font-medium hover:bg-[#dce6f1] transition-colors flex items-center justify-center"
                        >
                          <FaHeart className="mr-2" /> Add to Wishlist
                        </button>
                      </>
                    )}

                    {/* Agency Actions */}
                    {role === "agency" && (
                      <>
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="w-full bg-[#0a66c2] text-white py-3 rounded font-medium hover:bg-[#004182] transition-colors flex items-center justify-center"
                        >
                          <FaEdit className="mr-2" /> Update Package
                        </button>

                        <button
                          onClick={handleDeletePackage}
                          className="w-full bg-[#f3f6f8] text-[#b24020] py-3 rounded font-medium hover:bg-[#f5e9e5] transition-colors flex items-center justify-center"
                        >
                          <FaTrash className="mr-2" /> Delete Package
                        </button>
                      </>
                    )}

                    {/* Guide Actions */}
                    {role === "guide" && (
                      <>
                        {existingRequest ? (
                          <div className="space-y-3">
                            <div
                              className={`p-4 rounded-lg ${
                                existingRequest.status === "pending"
                                  ? "bg-[#f5efd9] text-[#e7a33e]"
                                  : existingRequest.status === "approved"
                                    ? "bg-[#eaf5ea] text-[#44712e]"
                                    : "bg-[#f5e9e5] text-[#b24020]"
                              }`}
                            >
                              <p className="font-medium">
                                Request Status:{" "}
                                {existingRequest.status
                                  .charAt(0)
                                  .toUpperCase() +
                                  existingRequest.status.slice(1)}
                              </p>
                              <p className="text-sm mt-1">
                                {existingRequest.status === "pending"
                                  ? "Your request is waiting for agency approval."
                                  : existingRequest.status === "approved"
                                    ? "Your request has been approved!"
                                    : "Your request has been rejected."}
                              </p>
                            </div>

                            {existingRequest.status === "pending" && (
                              <button
                                onClick={handleCancelGuideRequest}
                                className="w-full bg-[#f3f6f8] text-[#b24020] py-3 rounded font-medium hover:bg-[#f5e9e5] transition-colors flex items-center justify-center"
                              >
                                <FaTimes className="mr-2" /> Cancel Request
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowGuideRequestModal(true)}
                            className="w-full bg-[#0a66c2] text-white py-3 rounded font-medium hover:bg-[#004182] transition-colors flex items-center justify-center"
                          >
                            <FaPaperPlane className="mr-2" /> Request to Agency
                          </button>
                        )}
                      </>
                    )}

                    {/* Guest Actions */}
                    {role === "guest" && (
                      <Link
                        to="/login"
                        className="w-full bg-[#0a66c2] text-white py-3 rounded font-medium hover:bg-[#004182] transition-colors flex items-center justify-center"
                      >
                        <FaUser className="mr-2" /> Login to Book
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-[#38434f] mb-4">
              {requestType === "book" ? "Book Package" : "Customize Package"}
            </h2>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Request Type:
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="p-2 w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              >
                <option value="book">Book</option>
                <option value="customize">Customize</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Price:
              </label>
              <input
                type="number"
                value={customDetails.price}
                onChange={(e) =>
                  handleCustomDetailsChange("price", e.target.value)
                }
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Duration (days):
              </label>
              <input
                type="number"
                value={customDetails.duration}
                onChange={(e) =>
                  handleCustomDetailsChange(
                    "duration",
                    parseInt(e.target.value, 10)
                  )
                }
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Itinerary:
              </label>
              <textarea
                value={customDetails.itinerary}
                onChange={(e) =>
                  handleCustomDetailsChange("itinerary", e.target.value)
                }
                className=" w-full p-2 bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                rows="4"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Select Date:
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  handleCustomDetailsChange("availableDates", [date]);
                }}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Click to select a date"
                className="p-2 w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Max Group Size:
              </label>
              <input
                type="number"
                value={customDetails.maxGroupSize}
                onChange={(e) =>
                  handleCustomDetailsChange(
                    "maxGroupSize",
                    parseInt(e.target.value, 10)
                  )
                }
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                rows="3"
                placeholder="Any special requests or additional information..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 border border-[#dce6f1] rounded text-[#56687a] hover:bg-[#f3f6f8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomerRequestSubmit}
                className="px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-[#38434f] mb-4">
              Rate and Review
            </h2>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Select Your Booking:
              </label>
              {customerBookings.length > 0 ? (
                <select
                  className="w-full p-2 border border-[#dce6f1] rounded focus:outline-none focus:ring-2 focus:ring-[#0a66c2] text-[#38434f]"
                  onChange={(e) => setBookingId(e.target.value)}
                >
                  <option value="">Select a booking</option>
                  {customerBookings.map((booking) => (
                    <option key={booking._id} value={booking._id}>
                      {booking.bookingId || booking._id} -{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-[#b24020]">
                  You have not booked this package yet. Please book the package
                  before leaving a review.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Rating:
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="text-2xl focus:outline-none"
                  >
                    <FaStar
                      className={
                        value <= rating ? "text-[#e7a33e]" : "text-[#e9e5df]"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-[#56687a]">{rating} of 5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Comment:
              </label>
              <textarea
                className="w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-[#dce6f1] rounded text-[#56687a] hover:bg-[#f3f6f8] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSubmitReview}
                className={`px-4 py-2 rounded ${
                  !bookingId && customerBookings.length > 0
                    ? "bg-[#dce6f1] text-[#56687a] cursor-not-allowed"
                    : "bg-[#0a66c2] text-white hover:bg-[#004182]"
                } transition-colors`}
                disabled={!bookingId && customerBookings.length > 0}
              >
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-[#38434f] mb-4">
              Update Package
            </h2>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Name:
              </label>
              <input
                type="text"
                value={editedPackage.name}
                onChange={(e) =>
                  setEditedPackage({ ...editedPackage, name: e.target.value })
                }
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Price:
              </label>
              <input
                type="number"
                value={editedPackage.price}
                onChange={(e) =>
                  setEditedPackage({ ...editedPackage, price: e.target.value })
                }
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Description:
              </label>
              <textarea
                value={editedPackage.description}
                onChange={(e) =>
                  setEditedPackage({
                    ...editedPackage,
                    description: e.target.value,
                  })
                }
                className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-[#dce6f1] rounded text-[#56687a] hover:bg-[#f3f6f8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePackage}
                className="px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Guide Request Modal */}
      {showGuideRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-[#38434f] mb-4">
              Request to Guide Package
            </h2>

            <div className="mb-4">
              <label className="block text-[#56687a] text-sm font-medium mb-1">
                Message to Agency:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why you're interested in guiding this package..."
                className="w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                rows="4"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGuideRequestModal(false)}
                className="px-4 py-2 border border-[#dce6f1] rounded text-[#56687a] hover:bg-[#f3f6f8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendGuideRequest}
                className="px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
              >
                Send Request
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ViewPage;
