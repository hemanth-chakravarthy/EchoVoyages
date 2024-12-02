import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="flex justify-center my-4">
        <progress
          className="progress w-56"
          value={progress}
          max="100"
        ></progress>
      </div>

      {/* Step 1: Package Info */}
      {currentStep === 1 && (
        <div>
          <div>
            <label htmlFor="name">Package Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              type="text"
              placeholder="Enter package name"
              className="input input-bordered w-full"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="textarea textarea-bordered w-full"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              type="number"
              placeholder="Enter price"
              className="input input-bordered w-full"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              type="number"
              placeholder="Enter duration"
              className="input input-bordered w-full"
            />
            {errors.duration && (
              <p className="text-red-500">{errors.duration}</p>
            )}
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              type="text"
              placeholder="Enter location"
              className="input input-bordered w-full"
            />
            {errors.location && (
              <p className="text-red-500">{errors.location}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Package Details */}
      {currentStep === 2 && (
        <div>
          <div>
            <label htmlFor="itinerary">Itinerary</label>
            <textarea
              id="itinerary"
              name="itinerary"
              value={formData.itinerary}
              onChange={handleInputChange}
              placeholder="Enter itinerary"
              className="textarea textarea-bordered w-full"
            />
            {errors.itinerary && (
              <p className="text-red-500">{errors.itinerary}</p>
            )}
          </div>

          <div>
            <label htmlFor="highlights">Highlights</label>
            <textarea
              id="highlights"
              name="highlights"
              value={formData.highlights}
              onChange={handleInputChange}
              placeholder="Enter highlights"
              className="textarea textarea-bordered w-full"
            />
            {errors.highlights && (
              <p className="text-red-500">{errors.highlights}</p>
            )}
          </div>

          <div>
            <label htmlFor="availableDates">Available Dates</label>
            <input
              id="availableDates"
              name="availableDates"
              value={formData.availableDates}
              onChange={handleInputChange}
              type="date"
              className="input input-bordered w-full"
            />
            {errors.availableDates && (
              <p className="text-red-500">{errors.availableDates}</p>
            )}
          </div>

          <div>
            <label htmlFor="maxGroupSize">Max Group Size</label>
            <input
              id="maxGroupSize"
              name="maxGroupSize"
              value={formData.maxGroupSize}
              onChange={handleInputChange}
              type="number"
              placeholder="Enter max group size"
              className="input input-bordered w-full"
            />
            {errors.maxGroupSize && (
              <p className="text-red-500">{errors.maxGroupSize}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Upload Images */}
      {currentStep === 3 && (
        <div>
          <label htmlFor="images">Upload Images</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {errors.images && <p className="text-red-500">{errors.images}</p>}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-secondary"
          >
            Previous
          </button>
        )}
        {currentStep < 3 && (
          <button type="button" onClick={nextStep} className="btn btn-primary">
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        )}
      </div>

      {/* Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Success!</h3>
          <p className="py-4">Your package has been successfully created.</p>
        </div>
      </dialog>
    </form>
  );
};

export default CreatePackage;
