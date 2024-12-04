import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    // Validate date ranges
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
      alert("Guide details updated successfully");
      setGuide(updatedGuide);
      setEditing(false);
      navigate("/GuideProfilePage");
    } catch (error) {
      console.error("Error updating guide details:", error);
      alert("Error occurred while saving guide details");
    }
  };

  const handleCancel = () => {
    setUpdatedGuide(guide);
    setEditing(false);
  };

  if (loading) {
    return <p>Loading guide details...</p>;
  }

  if (!guide) {
    return <p>Guide not found!</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto  min-h-screen">
  <nav className="mb-6">
        <ul className="flex justify-around  text-white p-4 rounded">
          <Link to={"/guideHome"} className="hover:underline btn btn-primary">
            Guide Home
          </Link>
          <Link to={`/GuideProfilePage`} className="hover:underline btn btn-primary">
            Profile Page
          </Link>
        </ul>
  </nav>
  <h1 className="text-3xl font-bold mb-6 text-center ">
    Guide Profile
  </h1>

  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-2xl font-semibold mb-2 text-black">
      {editing ? (
        <>
          <input
            type="text"
            name="name"
            className="border border-gray-300 rounded p-2 w-full"
            value={updatedGuide.name}
            onChange={handleChange}
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.name}
            </p>
          )}
        </>
      ) : (
        guide.name
      )}
    </h2>
    <p className="text-gray-700">
      <strong>Username:</strong> {guide.username}
    </p>
    <p className="text-gray-700">
      <strong>Experience:</strong>{" "}
      {editing ? (
        <>
          <input
            type="number"
            name="experience"
            className="border border-gray-300 rounded p-2 w-full"
            value={updatedGuide.experience}
            onChange={handleChange}
          />
          {validationErrors.experience && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.experience}
            </p>
          )}
        </>
      ) : (
        `${guide.experience} years`
      )}
    </p>
    <p className="text-gray-700">
      <strong>Languages Spoken:</strong>{" "}
      {editing ? (
        <>
          <input
            type="text"
            name="languages"
            className="border border-gray-300 rounded p-2 w-full"
            value={updatedGuide.languages.join(", ")}
            onChange={handleChange}
          />
          {validationErrors.languages && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.languages}
            </p>
          )}
        </>
      ) : (
        guide.languages.join(", ")
      )}
    </p>
    <p className="text-gray-700">
      <strong>Location:</strong>{" "}
      {editing ? (
        <>
          <input
            type="text"
            name="location"
            className="border border-gray-300 rounded p-2 w-full"
            value={updatedGuide.location}
            onChange={handleChange}
          />
          {validationErrors.location && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.location}
            </p>
          )}
        </>
      ) : (
        guide.location || "N/A"
      )}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-black">
    <h3 className="text-xl font-semibold mb-4 ">Availability & Packages</h3>
    {editing ? (
      <>
        {updatedGuide.availableDates.map((dateRange, index) => (
          <div key={index} className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Start Date:</label>
              <input
                type="date"
                className="border border-gray-300 rounded p-2 w-full"
                value={dateRange.startDate}
                onChange={(e) =>
                  handleAvailabilityDateChange(index, "startDate", e.target.value)
                }
              />
              {validationErrors[`startDate${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors[`startDate${index}`]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">End Date:</label>
              <input
                type="date"
                className="border border-gray-300 rounded p-2 w-full"
                value={dateRange.endDate}
                onChange={(e) =>
                  handleAvailabilityDateChange(index, "endDate", e.target.value)
                }
              />
              {validationErrors[`endDate${index}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors[`endDate${index}`]}
                </p>
              )}
            </div>
            <button
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              onClick={() => handleRemoveDateRange(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
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

  <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-black">
    <h3 className="text-xl font-semibold mb-4">Ratings</h3>
    <p className="text-gray-700">
      <strong>Average Rating:</strong> {guide.ratings.averageRating} / 5
    </p>
    <p className="text-gray-700">
      <strong>Number of Reviews:</strong> {guide.ratings.numberOfReviews}
    </p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-xl font-semibold mb-4 text-black">Contact Information</h3>
    <p className="text-gray-700">
      <strong>Phone:</strong>{" "}
      {editing ? (
        <>
          <input
            type="text"
            name="phone"
            className="border border-gray-300 rounded p-2 w-full"
            value={updatedGuide.phno}
            onChange={(e) => handleNestedChange(e, "contact")}
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.phone}
            </p>
          )}
        </>
      ) : (
        guide.phno
      )}
    </p>
    <p className="text-gray-700">
      <strong>Email:</strong>{" "}
      {editing ? (
        <>
          <input
            type="email"
            name="email"
            className="border border-gray-300 rounded p-2 w-full"
            value={updatedGuide.gmail}
            onChange={(e) => handleNestedChange(e, "contact")}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </>
      ) : (
        guide.gmail
      )}
    </p>
  </div>

  <div className="flex justify-between items-center">
    {editing ? (
      <>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleEditToggle}
      >
        Edit Profile
      </button>
    )}
    <p
      className="text-red-500 cursor-pointer underline"
      onClick={handleLogout}
    >
      Logout
    </p>
  </div>
</div>

  );
};

export default GuideProfilePage;
