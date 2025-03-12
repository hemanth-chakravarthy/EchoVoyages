import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
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
          `http://localhost:5000/reviews/guides/${guideId}`
        );
        const reviewsData = response.data.review;
        setReviews(reviewsData);

        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / reviewsData.length;

          await axios.put(`http://localhost:5000/guides/${guideId}`, {
            ...updatedGuide,
            ratings: {
              averageRating: averageRating.toFixed(1),
              numberOfReviews: reviewsData.length,
            },
          });

          setGuide((prevGuide) => ({
            ...prevGuide,
            ratings: {
              averageRating: averageRating.toFixed(1),
              numberOfReviews: reviewsData.length,
            },
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
    setEditing(!editing);
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
      await axios.put(`http://localhost:5000/guides/${guideId}`, updatedGuide);
      toast.success("Guide details updated successfully");
      setGuide(updatedGuide);
      setEditing(false);
      navigate("/GuideProfilePage");
    } catch (error) {
      console.error("Error updating guide details:", error);
      toast.error("Error occurred while saving guide details");
    }
  };

  const handleCancel = () => {
    setUpdatedGuide(guide);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Guide not found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <nav className="navbar bg-base-100 shadow-lg mb-6">
        
      <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex-1">
          <Link to="/guideHome" className="btn btn-ghost normal-case text-xl">
            Guide Home
          </Link>
        </div>
        <div className="flex-none">
          <Link to="/GuideProfilePage" className="btn btn-w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient">
            Profile Page
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-base-content">
          Guide Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
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
              <button className="btn btn-w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient" onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient" onClick={handleEditToggle}>
              Edit Profile
            </button>
          )}
          <button className="btn btn-error" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideProfilePage;
