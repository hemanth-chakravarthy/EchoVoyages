/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLanguage,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaStar,
  FaEdit,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";
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
        const response = await axios.get(`${apiUrl}/guides/${guideId}`);
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
          `${apiUrl}/reviews/guides/${guideId}/details`
        );
        setReviews(response.data.review || []);
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
    if (guide.profilePicture) {
      setPreviewUrl(`${apiUrl}/${guide.profilePicture}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "languages") {
      const languagesArray = value.split(",").map((lang) => lang.trim());
      setUpdatedGuide({ ...updatedGuide, languages: languagesArray });
    } else {
      setUpdatedGuide({ ...updatedGuide, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
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

  const handleAvailabilityDateChange = (index, field, value) => {
    const updatedDates = [...updatedGuide.availableDates];
    updatedDates[index] = { ...updatedDates[index], [field]: value };
    setUpdatedGuide({ ...updatedGuide, availableDates: updatedDates });
  };

  const handleAddDateRange = () => {
    setUpdatedGuide({
      ...updatedGuide,
      availableDates: [...updatedGuide.availableDates, { startDate: "", endDate: "" }],
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!updatedGuide.name || updatedGuide.name.trim() === "") errors.name = "Name is required";
    if (!updatedGuide.experience || updatedGuide.experience <= 0) errors.experience = "Experience must be a positive number";
    if (!updatedGuide.languages || updatedGuide.languages.length === 0) errors.languages = "Languages cannot be empty";
    if (!updatedGuide.location || updatedGuide.location.trim() === "") errors.location = "Location is required";
    if (!updatedGuide.phno || updatedGuide.phno.trim() === "") errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(updatedGuide.phno)) errors.phone = "Phone number must be 10 digits";
    if (!updatedGuide.gmail || !/\S+@\S+\.\S+/.test(updatedGuide.gmail)) errors.email = "A valid email address is required";
    const dateErrors = validateAvailabilityDates();
    if (Object.keys(dateErrors).length > 0) errors = { ...errors, ...dateErrors };
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRemoveDateRange = (index) => {
    const updatedDates = updatedGuide.availableDates.filter((_, i) => i !== index);
    setUpdatedGuide({ ...updatedGuide, availableDates: updatedDates });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      Object.keys(updatedGuide).forEach((key) => {
        if (key === "languages") {
          formData.append(key, JSON.stringify(updatedGuide[key] || []));
        } else if (key === "availableDates") {
          const dates = Array.isArray(updatedGuide[key]) ? updatedGuide[key] : [];
          formData.append(key, JSON.stringify(dates));
        } else if (key === "ratings") {
          formData.append("ratings", JSON.stringify(updatedGuide.ratings || {}));
        } else {
          formData.append(key, updatedGuide[key] || "");
        }
      });
      if (profileImage) formData.append("profilePicture", profileImage);
      const response = await axios.put(`${apiUrl}/guides/${guideId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
          </div>
          <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="border border-[#111111]/10 p-8 md:p-16 text-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
            Guide Not Found
          </h2>
          <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
            The requested guide profile could not be located.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            007 / Profile
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            {guide.name}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Manage your guide profile, availability, and contact information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="border border-[#111111]/10 bg-[#ffffff] mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Profile Picture */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#111111]/10 p-6 md:p-8 flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 border border-[#111111]/20 overflow-hidden">
                  {editing && previewUrl ? (
                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : guide.profilePicture ? (
                    <img src={`${apiUrl}/${guide.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-[#111111]/20 text-5xl" />
                    </div>
                  )}
                </div>
                {editing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="text-white text-xl" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              {editing && (
                <div className="mt-6 w-full">
                  <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                    Update Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-[10px] uppercase tracking-widest text-[#111111]/60 file:bg-[#111111] file:text-[#f5f3f0] file:px-4 file:py-2 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#1a1a1a]"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 w-full space-y-3">
                {!editing ? (
                  <button
                    onClick={handleEditToggle}
                    className="w-full bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <FaEdit className="text-xs" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="w-full bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Languages */}
                <div className="flex items-start gap-3">
                  <FaLanguage className="text-[#111111]/30 text-xs mt-1" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                      Languages
                    </p>
                    {editing ? (
                      <input
                        type="text"
                        name="languages"
                        value={updatedGuide.languages.join(", ")}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {guide.languages.map((lang, i) => (
                          <span key={i} className="px-3 py-1 border border-[#111111]/20 text-[10px] font-bold uppercase tracking-widest text-[#111111]/70">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#111111]/30 text-xs mt-1" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                      Location
                    </p>
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        value={updatedGuide.location}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                    ) : (
                      <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                        {guide.location || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-start gap-3">
                  <FaStar className="text-[#111111]/30 text-xs mt-1" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                      Rating
                    </p>
                    <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                      {guide.ratings.averageRating.toFixed(1)} / 5.0 ({guide.ratings.numberOfReviews} reviews)
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-[#111111]/30 text-xs mt-1" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                      Experience
                    </p>
                    {editing ? (
                      <input
                        type="number"
                        name="experience"
                        value={updatedGuide.experience}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                    ) : (
                      <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                        {guide.experience} YEARS
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-[#111111]/10 pt-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 mb-6">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-[#111111]/30 text-xs mt-1" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                        Phone
                      </p>
                      {editing ? (
                        <input
                          type="text"
                          name="phno"
                          value={updatedGuide.phno}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                        />
                      ) : (
                        <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                          {guide.phno}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-[#111111]/30 text-xs mt-1" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                        Email
                      </p>
                      {editing ? (
                        <input
                          type="email"
                          name="gmail"
                          value={updatedGuide.gmail}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                        />
                      ) : (
                        <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                          {guide.gmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="border border-[#111111]/10 bg-[#ffffff]">
          <div className="flex items-center gap-3 p-6 md:p-8 border-b border-[#111111]/10">
            <FaCalendarAlt className="text-[#111111]/40 text-lg" />
            <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
              Available Dates
            </h3>
          </div>

          <div className="p-6 md:p-8">
            {editing ? (
              <div className="space-y-4">
                {updatedGuide.availableDates.map((dateRange, index) => (
                  <div key={index} className="flex flex-wrap items-end gap-4 p-4 bg-[#f0eeeb]">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleAvailabilityDateChange(index, "startDate", e.target.value)}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleAvailabilityDateChange(index, "endDate", e.target.value)}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                    </div>
                    <button
                      className="px-4 py-2 text-red-600 border border-red-500/30 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300"
                      onClick={() => handleRemoveDateRange(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddDateRange}
                  className="w-full mt-4 border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt /> Add Date Range
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guide.availableDates.length > 0 ? (
                  guide.availableDates.map((dateRange, index) => (
                    <div key={index} className="p-4 bg-[#f0eeeb]">
                      <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                        Range {index + 1}
                      </p>
                      <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                        {new Date(dateRange.startDate).toLocaleDateString()} —{" "}
                        {new Date(dateRange.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
                      No availability dates set.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="border border-red-500/30 text-red-600 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default GuideProfilePage;
