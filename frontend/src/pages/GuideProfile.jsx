/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaLanguage, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaStar, FaEdit, FaSignOutAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const GuideProfilePage = () => {
  const guideId = jwtDecode(localStorage.getItem("token")).id;
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedGuide, setUpdatedGuide] = useState(null);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/guides/${guideId}`
        );
        setGuide(response.data);
        setUpdatedGuide(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching guide details:", error);
        setLoading(false);
      }
    };

    const fetchReviewsAndCalculateRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/guides/${guideId}/details`
        );
        setReviews(response.data.review || []);

        // The guide data already has updated ratings from the backend
        if (response.data.guide) {
          setGuide((prevGuide) => ({
            ...prevGuide,
            ratings: response.data.guide.ratings,
          }));
        }
      } catch (error) {
        console.error("Error fetching reviews and calculating rating:", error);
      }
    };

    fetchGuideDetails();
    fetchReviewsAndCalculateRating();
  }, [guideId]);

  const handleEditToggle = () => {
    // Create a deep copy of the guide object with proper handling of arrays and nested objects
    const guideCopy = {
      ...guide,
      languages: Array.isArray(guide.languages) ? [...guide.languages] : [],
      availableDates: Array.isArray(guide.availableDates)
        ? [...guide.availableDates]
        : [],
      ratings: guide.ratings
        ? { ...guide.ratings }
        : { averageRating: 0, numberOfReviews: 0 },
    };

    setUpdatedGuide(guideCopy);
    setEditing(true);

    // Set preview URL if guide has a profile picture
    if (guide.profilePicture) {
      setPreviewUrl(`http://localhost:5000/${guide.profilePicture}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "languages") {
      const languagesArray = value.split(",").map((lang) => lang.trim());
      setUpdatedGuide({
        ...updatedGuide,
        languages: languagesArray,
      });
    } else {
      setUpdatedGuide({
        ...updatedGuide,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAvailabilityDates = () => {
    let dateErrors = {};
    const today = new Date().toISOString().split("T")[0];

    updatedGuide.availableDates.forEach((dateRange, index) => {
      const { startDate, endDate } = dateRange;

      if (!startDate) {
        dateErrors[`startDate${index}`] = "Start date is required";
      } else if (startDate <= today) {
        dateErrors[`startDate${index}`] = "Start date must be after today";
      }

      if (!endDate) {
        dateErrors[`endDate${index}`] = "End date is required";
      } else if (endDate <= startDate) {
        dateErrors[`endDate${index}`] = "End date must be after start date";
      }
    });

    return dateErrors;
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setUpdatedGuide({
      ...updatedGuide,
      [parentKey]: {
        ...updatedGuide[parentKey],
        [name]: value,
      },
    });
  };

  const handleAvailabilityDateChange = (index, field, value) => {
    const updatedDates = [...updatedGuide.availableDates];
    updatedDates[index] = { ...updatedDates[index], [field]: value };
    setUpdatedGuide({
      ...updatedGuide,
      availableDates: updatedDates,
    });
  };

  const handleAddDateRange = () => {
    setUpdatedGuide({
      ...updatedGuide,
      availableDates: [
        ...updatedGuide.availableDates,
        { startDate: "", endDate: "" },
      ],
    });
  };

  const validateForm = () => {
    let errors = {};

    if (!updatedGuide.name || updatedGuide.name.trim() === "") {
      errors.name = "Name is required";
    }

    if (!updatedGuide.experience || updatedGuide.experience <= 0) {
      errors.experience = "Experience must be a positive number";
    }

    if (!updatedGuide.languages || updatedGuide.languages.length === 0) {
      errors.languages = "Languages cannot be empty";
    }

    if (!updatedGuide.location || updatedGuide.location.trim() === "") {
      errors.location = "Location is required";
    }

    if (!updatedGuide.phno || updatedGuide.phno.trim() === "") {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(updatedGuide.phno)) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!updatedGuide.gmail || !/\S+@\S+\.\S+/.test(updatedGuide.gmail)) {
      errors.email = "A valid email address is required";
    }

    const dateErrors = validateAvailabilityDates();
    if (Object.keys(dateErrors).length > 0) {
      errors = { ...errors, ...dateErrors };
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRemoveDateRange = (index) => {
    const updatedDates = updatedGuide.availableDates.filter(
      (_, i) => i !== index
    );
    setUpdatedGuide({
      ...updatedGuide,
      availableDates: updatedDates,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData object for file upload
      const formData = new FormData();

      // Add all guide data to FormData
      Object.keys(updatedGuide).forEach((key) => {
        if (key === "languages") {
          // Handle languages array
          formData.append(key, JSON.stringify(updatedGuide[key] || []));
        } else if (key === "availableDates") {
          // Handle availableDates array - ensure it's a valid array
          const dates = Array.isArray(updatedGuide[key])
            ? updatedGuide[key]
            : [];
          formData.append(key, JSON.stringify(dates));
        } else if (key === "ratings") {
          // Handle nested ratings object
          formData.append(
            "ratings",
            JSON.stringify(updatedGuide.ratings || {})
          );
        } else {
          // Handle other fields
          formData.append(key, updatedGuide[key] || "");
        }
      });

      // Add profile image if selected
      if (profileImage) {
        formData.append("profilePicture", profileImage);
      }

      // Send the request
      const response = await axios.put(
        `http://localhost:5000/guides/${guideId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Guide details updated successfully");
      setGuide(response.data);
      setEditing(false);
      setProfileImage(null);
      setPreviewUrl(null);
      navigate("/GuideProfile");
    } catch (error) {
      console.error("Error updating guide details:", error);
      toast.error("Error occurred while saving guide details");
    }
  };

  const handleCancel = () => {
    setUpdatedGuide(guide);
    setEditing(false);
    setProfileImage(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
        }}
      >
        <span className="loading loading-spinner loading-lg text-[#4169E1]"></span>
      </motion.div>
    );
  }

  if (!guide) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
        }}
      >
        <div className="text-[#1a365d] text-xl">Guide not found!</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f3f6f8] font-['Inter',sans-serif]"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.main
        className="max-w-7xl mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Picture Section */}
            <div className="w-full md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-[#0a66c2]/10">
                  {editing && previewUrl ? (
                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : guide.profilePicture ? (
                    <img src={`http://localhost:5000/${guide.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#0a66c2]/5 flex items-center justify-center">
                      <FaUser className="text-[#0a66c2] text-5xl" />
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#0a66c2] file:text-white
                        hover:file:bg-[#084e96]
                        transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Main Profile Info */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      className="input w-full max-w-md text-3xl bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                      value={updatedGuide.name}
                      onChange={handleChange}
                    />
                  ) : (
                    guide.name
                  )}
                </h1>
                <div className="flex gap-4">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-[#0a66c2] text-white rounded-full hover:bg-[#084e96] transition-all duration-300"
                      >
                        <FaEdit className="text-sm" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-6 py-2 bg-[#0a66c2] text-white rounded-full hover:bg-[#084e96] transition-all duration-300"
                    >
                      <FaEdit className="text-sm" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <FaLanguage className="text-[#0a66c2] text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="font-medium">
                      {editing ? (
                        <input
                          type="text"
                          name="languages"
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                          value={updatedGuide.languages.join(", ")}
                          onChange={handleChange}
                        />
                      ) : (
                        guide.languages.join(", ")
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#0a66c2] text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {editing ? (
                        <input
                          type="text"
                          name="location"
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                          value={updatedGuide.location}
                          onChange={handleChange}
                        />
                      ) : (
                        guide.location || "N/A"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaStar className="text-[#0a66c2] text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-medium">
                      {guide.ratings.averageRating.toFixed(1)} / 5.0 ({guide.ratings.numberOfReviews} reviews)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-[#0a66c2] text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">
                      {editing ? (
                        <input
                          type="number"
                          name="experience"
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                          value={updatedGuide.experience}
                          onChange={handleChange}
                        />
                      ) : (
                        `${guide.experience} years`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-[#0a66c2] text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {editing ? (
                          <input
                            type="text"
                            name="phno"
                            className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                            value={updatedGuide.phno}
                            onChange={handleChange}
                          />
                        ) : (
                          guide.phno
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-[#0a66c2] text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {editing ? (
                          <input
                            type="email"
                            name="gmail"
                            className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                            value={updatedGuide.gmail}
                            onChange={handleChange}
                          />
                        ) : (
                          guide.gmail
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-[#0a66c2]" />
            Available Dates
          </h3>
          
          {editing ? (
            <div className="space-y-4">
              {updatedGuide.availableDates.map((dateRange, index) => (
                <div key={index} className="flex flex-wrap items-end gap-4 p-4 bg-[#f3f6f8] rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-lg bg-white border border-[#0a66c2]/20 
                      focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] focus:outline-none
                      text-gray-700 transition-all duration-300"
                      value={dateRange.startDate}
                      onChange={(e) => handleAvailabilityDateChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-lg bg-white border border-[#0a66c2]/20 
                      focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] focus:outline-none
                      text-gray-700 transition-all duration-300"
                      value={dateRange.endDate}
                      onChange={(e) => handleAvailabilityDateChange(index, "endDate", e.target.value)}
                    />
                  </div>
                  <button
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                    onClick={() => handleRemoveDateRange(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddDateRange}
                className="w-full mt-4 px-6 py-3 bg-[#0a66c2]/10 text-[#0a66c2] rounded-lg hover:bg-[#0a66c2]/20 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaCalendarAlt /> Add Date Range
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guide.availableDates.map((dateRange, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Date Range {index + 1}</p>
                  <p className="font-medium">
                    {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </motion.main>
    </motion.div>
  );
};

export default GuideProfilePage;
