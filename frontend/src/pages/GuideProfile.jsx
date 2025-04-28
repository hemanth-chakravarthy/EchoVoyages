import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion"; // Add this import
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
          setGuide(prevGuide => ({
            ...prevGuide,
            ratings: response.data.guide.ratings
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
      availableDates: Array.isArray(guide.availableDates) ? [...guide.availableDates] : [],
      ratings: guide.ratings ? { ...guide.ratings } : { averageRating: 0, numberOfReviews: 0 }
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
      Object.keys(updatedGuide).forEach(key => {
        if (key === 'languages') {
          // Handle languages array
          formData.append(key, JSON.stringify(updatedGuide[key] || []));
        } else if (key === 'availableDates') {
          // Handle availableDates array - ensure it's a valid array
          const dates = Array.isArray(updatedGuide[key]) ? updatedGuide[key] : [];
          formData.append(key, JSON.stringify(dates));
        } else if (key === 'ratings') {
          // Handle nested ratings object
          formData.append('ratings', JSON.stringify(updatedGuide.ratings || {}));
        } else {
          // Handle other fields
          formData.append(key, updatedGuide[key] || '');
        }
      });

      // Add profile image if selected
      if (profileImage) {
        formData.append('profilePicture', profileImage);
      }

      // Send the request
      const response = await axios.put(
        `http://localhost:5000/guides/${guideId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          backgroundColor: 'rgba(255, 255, 255, 0.97)'
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
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          backgroundColor: 'rgba(255, 255, 255, 0.97)'
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
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Navbar removed - now using RoleBasedNavbar from Layout component */}

      <motion.main
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-base-content">
          Guide Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-200">
                    {editing && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : guide.profilePicture ? (
                      <img
                        src={`http://localhost:5000/${guide.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-4xl">
                          {guide.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {editing && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </div>
                  )}
                </div>

                <h2 className="card-title text-2xl mb-4">
                  {editing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        className="input input-bordered w-full"
                        value={updatedGuide.name}
                        onChange={handleChange}
                      />
                      {validationErrors.name && (
                        <p className="text-error text-sm mt-1">
                          {validationErrors.name}
                        </p>
                      )}
                    </>
                  ) : (
                    guide.name
                  )}
                </h2>
                <p>
                  <strong>Username:</strong> {guide.username}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {editing ? (
                    <>
                      <input
                        type="number"
                        name="experience"
                        className="input input-bordered w-full mt-1"
                        value={updatedGuide.experience}
                        onChange={handleChange}
                      />
                      {validationErrors.experience && (
                        <p className="text-error text-sm mt-1">
                          {validationErrors.experience}
                        </p>
                      )}
                    </>
                  ) : (
                    `${guide.experience} years`
                  )}
                </p>
                <p>
                  <strong>Languages Spoken:</strong>{" "}
                  {editing ? (
                    <>
                      <input
                        type="text"
                        name="languages"
                        className="input input-bordered w-full mt-1"
                        value={updatedGuide.languages.join(", ")}
                        onChange={handleChange}
                      />
                      {validationErrors.languages && (
                        <p className="text-error text-sm mt-1">
                          {validationErrors.languages}
                        </p>
                      )}
                    </>
                  ) : (
                    guide.languages.join(", ")
                  )}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {editing ? (
                    <>
                      <input
                        type="text"
                        name="location"
                        className="input input-bordered w-full mt-1"
                        value={updatedGuide.location}
                        onChange={handleChange}
                      />
                      {validationErrors.location && (
                        <p className="text-error text-sm mt-1">
                          {validationErrors.location}
                        </p>
                      )}
                    </>
                  ) : (
                    guide.location || "N/A"
                  )}
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Contact Information</h3>
                <p>
                  <strong>Phone:</strong>{" "}
                  {editing ? (
                    <>
                      <input
                        type="text"
                        name="phno"
                        className="input input-bordered w-full mt-1"
                        value={updatedGuide.phno}
                        onChange={handleChange}
                      />
                      {validationErrors.phone && (
                        <p className="text-error text-sm mt-1">
                          {validationErrors.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    guide.phno
                  )}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {editing ? (
                    <>
                      <input
                        type="email"
                        name="gmail"
                        className="input input-bordered w-full mt-1"
                        value={updatedGuide.gmail}
                        onChange={handleChange}
                      />
                      {validationErrors.email && (
                        <p className="text-error text-sm mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </>
                  ) : (
                    guide.gmail
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">
                  Availability & Packages
                </h3>
                {editing ? (
                  <>
                    {updatedGuide.availableDates.map((dateRange, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex-1">
                            <label className="label">
                              <span className="label-text">Start Date:</span>
                            </label>
                            <input
                              type="date"
                              className="input input-bordered w-full"
                              value={dateRange.startDate}
                              onChange={(e) =>
                                handleAvailabilityDateChange(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                            {validationErrors[`startDate${index}`] && (
                              <p className="text-error text-sm mt-1">
                                {validationErrors[`startDate${index}`]}
                              </p>
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="label">
                              <span className="label-text">End Date:</span>
                            </label>
                            <input
                              type="date"
                              className="input input-bordered w-full"
                              value={dateRange.endDate}
                              onChange={(e) =>
                                handleAvailabilityDateChange(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />
                            {validationErrors[`endDate${index}`] && (
                              <p className="text-error text-sm mt-1">
                                {validationErrors[`endDate${index}`]}
                              </p>
                            )}
                          </div>
                          <button
                            className="btn btn-error btn-sm mt-4"
                            onClick={() => handleRemoveDateRange(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
                      onClick={handleAddDateRange}
                    >
                      Add Date Range
                    </button>
                  </>
                ) : guide.availableDates && guide.availableDates.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {guide.availableDates.map((dateRange, index) => (
                      <li key={index} className="mb-2">
                        <strong>From:</strong>{" "}
                        {new Date(dateRange.startDate).toLocaleDateString()}{" "}
                        <strong>To:</strong>{" "}
                        {new Date(dateRange.endDate).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No available dates provided</p>
                )}
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Ratings</h3>
                <p>
                  <strong>Average Rating:</strong> {guide.ratings.averageRating}{" "}
                  / 5
                </p>
                <p>
                  <strong>Number of Reviews:</strong>{" "}
                  {guide.ratings.numberOfReviews}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          {editing ? (
            <>
              <button
                className="px-6 py-2 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="px-6 py-2 border border-[#1a365d] text-[#1a365d] rounded-full hover:bg-[#1a365d] hover:text-white transition-all duration-300"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300"
              onClick={handleEditToggle}
            >
              Edit Profile
            </button>
          )}
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </motion.main>
    </motion.div>
  );
};

export default GuideProfilePage;
