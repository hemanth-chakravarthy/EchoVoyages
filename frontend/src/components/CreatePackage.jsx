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
  const [errors, setErrors] = useState({}); // State for validation errors

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

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Package name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (formData.duration <= 0)
      newErrors.duration = "Duration must be greater than 0.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.itinerary) newErrors.itinerary = "Itinerary is required.";
    if (!formData.highlights) newErrors.highlights = "Highlights are required.";
    if (!formData.availableDates)
      newErrors.availableDates = "Available dates are required.";
    if (formData.maxGroupSize <= 0)
      newErrors.maxGroupSize = "Max group size must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
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
        body: formPayload, // No need to set headers for FormData
      });
      if (response.ok) {
        // Reset form fields and images if successful
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
        navigate("/AgentHome");
        console.log("Package created successfully!");
      } else {
        console.log("Failed to create package.");
      }
    } catch (err) {
      console.error("Error creating package:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group">
        <label>Package Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? "input-error" : ""}
          required
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={errors.description ? "input-error" : ""}
          required
        />
        {errors.description && (
          <p className="error-message">{errors.description}</p>
        )}
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className={errors.price ? "input-error" : ""}
          required
        />
        {errors.price && <p className="error-message">{errors.price}</p>}
      </div>

      <div className="form-group">
        <label>Duration (Days)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          className={errors.duration ? "input-error" : ""}
          required
        />
        {errors.duration && <p className="error-message">{errors.duration}</p>}
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className={errors.location ? "input-error" : ""}
          required
        />
        {errors.location && <p className="error-message">{errors.location}</p>}
      </div>

      <div className="form-group">
        <label>Itinerary</label>
        <textarea
          name="itinerary"
          value={formData.itinerary}
          onChange={handleInputChange}
          className={errors.itinerary ? "input-error" : ""}
          required
        />
        {errors.itinerary && (
          <p className="error-message">{errors.itinerary}</p>
        )}
      </div>

      <div className="form-group">
        <label>Highlights</label>
        <input
          type="text"
          name="highlights"
          value={formData.highlights}
          onChange={handleInputChange}
          className={errors.highlights ? "input-error" : ""}
          required
        />
        {errors.highlights && (
          <p className="error-message">{errors.highlights}</p>
        )}
      </div>

      <div className="form-group">
        <label>Available Dates</label>
        <input
          type="date"
          name="availableDates"
          value={formData.availableDates}
          onChange={handleInputChange}
          className={errors.availableDates ? "input-error" : ""}
          required
        />
        {errors.availableDates && (
          <p className="error-message">{errors.availableDates}</p>
        )}
      </div>

      <div className="form-group">
        <label>Max Group Size</label>
        <input
          type="number"
          name="maxGroupSize"
          value={formData.maxGroupSize}
          onChange={handleInputChange}
          className={errors.maxGroupSize ? "input-error" : ""}
          required
        />
        {errors.maxGroupSize && (
          <p className="error-message">{errors.maxGroupSize}</p>
        )}
      </div>

      <div className="form-group">
        <label>Images</label>
        <input
          type="file"
          name="images"
          onChange={handleImageChange}
          multiple
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Create Package
      </button>
    </form>
  );
};

export default CreatePackage;
