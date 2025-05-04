/** @format */

import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaImage,
  FaCalendarAlt,
  FaListUl,
  FaStar,
  FaInfoCircle,
  FaCheckCircle, // Add this import
} from "react-icons/fa";

const CreatePackage = () => {
  const navigate = useNavigate();
  const AgentId = jwtDecode(localStorage.getItem("token")).id;
  const AgentName = jwtDecode(localStorage.getItem("token")).name;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    itinerary: "",
    highlights: "",
    availableDates: "",
    maxGroupSize: "",
    AgentID: AgentId,
    AgentName: AgentName,
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(33);

  // Handling form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handling image file selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Validation logic for all steps
  const validateForm = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Package name is required.";
      if (!formData.description)
        newErrors.description = "Description is required.";
      if (formData.price <= 0)
        newErrors.price = "Price must be a positive number.";
      if (formData.duration <= 0)
        newErrors.duration = "Duration must be greater than 0.";
      if (!formData.location) newErrors.location = "Location is required.";
    }

    if (currentStep === 2) {
      if (!formData.itinerary) newErrors.itinerary = "Itinerary is required.";
      if (!formData.highlights)
        newErrors.highlights = "Highlights are required.";
      if (!formData.availableDates)
        newErrors.availableDates = "Available dates are required.";
      if (formData.maxGroupSize <= 0)
        newErrors.maxGroupSize = "Max group size must be greater than 0.";
    }

    if (currentStep === 3 && images.length === 0) {
      newErrors.images = "At least one image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // If form validation fails, prevent submission

    const formPayload = new FormData();
    // Append all form fields to FormData
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    // Append images to FormData
    images.forEach((image) => {
      formPayload.append("images", image);
    });

    try {
      const response = await fetch("http://localhost:5000/packages", {
        method: "POST",
        body: formPayload,
      });
      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          price: "",
          duration: "",
          location: "",
          itinerary: "",
          highlights: "",
          availableDates: "",
          maxGroupSize: "",
          AgentID: AgentId,
          AgentName: AgentName,
        });
        setImages([]);
        setProgress(100); // Complete the progress bar
        document.getElementById("my_modal_3").showModal(); // Open the modal
        setTimeout(() => {
          navigate("/AgentHome");
        }, 2000); // Redirect after dialog disappears
      } else {
        console.log("Failed to create package.");
      }
    } catch (err) {
      console.error("Error creating package:", err);
    }
  };

  // Handling next step
  const nextStep = () => {
    if (!validateForm()) return; // Validate before moving to the next step
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setProgress(progress + 33);
    }
  };

  // Handling previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(progress - 33);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8"
      >
        {/* Progress Bar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0a66c2] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Step {currentStep} of 3
          </p>
        </div>

        {/* Step 1: Package Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="form-group">
              <label
                className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                htmlFor="name"
              >
                <FaInfoCircle className="text-[#0a66c2]" />
                Package Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter package name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label
                className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                htmlFor="description"
              >
                <FaListUl className="text-[#0a66c2]" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Similar styling for price, duration, location inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label
                  className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                  htmlFor="price"
                >
                  <FaMoneyBillWave className="text-[#0a66c2]" />
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div className="form-group">
                <label
                  className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                  htmlFor="duration"
                >
                  <FaClock className="text-[#0a66c2]" />
                  Duration (Days)
                </label>
                <input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter duration"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label
                className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                htmlFor="location"
              >
                <FaMapMarkerAlt className="text-[#0a66c2]" />
                Location
              </label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Package Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="form-group">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2" htmlFor="itinerary">
                <FaListUl className="text-[#0a66c2]" />
                Itinerary
              </label>
              <textarea
                id="itinerary"
                name="itinerary"
                value={formData.itinerary}
                onChange={handleInputChange}
                placeholder="Enter detailed itinerary"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400 min-h-[100px]"
              />
              {errors.itinerary && <p className="text-red-500 text-sm mt-1">{errors.itinerary}</p>}
            </div>

            <div className="form-group">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2" htmlFor="highlights">
                <FaStar className="text-[#0a66c2]" />
                Highlights
              </label>
              <textarea
                id="highlights"
                name="highlights"
                value={formData.highlights}
                onChange={handleInputChange}
                placeholder="Enter package highlights"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
              />
              {errors.highlights && <p className="text-red-500 text-sm mt-1">{errors.highlights}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2" htmlFor="availableDates">
                  <FaCalendarAlt className="text-[#0a66c2]" />
                  Available Dates
                </label>
                <input
                  id="availableDates"
                  name="availableDates"
                  value={formData.availableDates}
                  onChange={handleInputChange}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
                />
                {errors.availableDates && <p className="text-red-500 text-sm mt-1">{errors.availableDates}</p>}
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2" htmlFor="maxGroupSize">
                  <FaUsers className="text-[#0a66c2]" />
                  Max Group Size
                </label>
                <input
                  id="maxGroupSize"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter maximum group size"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] bg-white hover:bg-gray-50 transition-colors placeholder-gray-400"
                />
                {errors.maxGroupSize && <p className="text-red-500 text-sm mt-1">{errors.maxGroupSize}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload Images */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <label
              className="flex items-center gap-2 text-gray-700 font-medium mb-2"
              htmlFor="images"
            >
              <FaImage className="text-[#0a66c2]" />
              Upload Images
            </label>
            <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#0a66c2] transition-colors text-center">
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                <span className="text-gray-600">Click to upload images</span>
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-white text-[#0a66c2] border border-[#0a66c2] font-medium rounded-full hover:bg-[#0a66c2]/5 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-[#0a66c2] text-white font-medium rounded-full hover:bg-[#0a66c2]/90 transition-colors ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-[#0a66c2] text-white font-medium rounded-full hover:bg-[#0a66c2]/90 transition-colors ml-auto"
            >
              Create Package
            </button>
          )}
        </div>

        {/* Success Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box bg-white rounded-xl shadow-xl p-6">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="text-center">
              <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600">
                Your package has been successfully created.
              </p>
            </div>
          </div>
        </dialog>
      </form>
    </div>
  );
};

export default CreatePackage;
