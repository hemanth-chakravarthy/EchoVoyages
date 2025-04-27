import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateEntity = () => {
  const [entity, setEntity] = useState({});
  const [entityType1, setEntityType] = useState(""); // Add state for entity type

  const navigate = useNavigate();
  const { id, type, entityType } = useParams(); // Get id and type/entityType from URL params
  const entityTypeValue = entityType || type; // Use entityType if available, otherwise use type
  console.log("Entity type:", entityTypeValue, "Entity ID:", id);

  useEffect(() => {
    // Fetch entity data based on id
    const fetchEntity = async () => {
      try {
        // Extract the entity type from the URL path
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/');

        // The URL format is /admin/[entity_type]/edit/[id]
        // So the entity type should be at index 2
        let actualEntityType = pathParts[2];

        console.log("Path parts:", pathParts);
        console.log("Extracted entity type:", actualEntityType);

        if (!actualEntityType) {
          throw new Error("Could not determine entity type from URL");
        }

        // Make the API request
        console.log(`Making request to: http://localhost:5000/admin/${actualEntityType}/${id}`);
        const response = await axios.get(`http://localhost:5000/admin/${actualEntityType}/${id}`);

        console.log("Fetched entity data:", response.data);
        setEntity(response.data);
        setEntityType(actualEntityType);
      } catch (error) {
        console.error("Error fetching entity:", error);
        toast.error(`Failed to fetch entity data: ${error.message}`);
      }
    };

    if (id) {
      fetchEntity();
    }
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity((prevEntity) => {
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        return {
          ...prevEntity,
          [parentKey]: {
            ...prevEntity[parentKey],
            [childKey]: value
          }
        };
      }
      return {
        ...prevEntity,
        [name]: value,
      };
    });
  };

  const handleEditEntity = async () => {
    try {
      // Make sure we're using the correct entity type from the state
      if (!entityType) {
        throw new Error("Entity type is not defined");
      }

      console.log("Updating entity:", entity, "with type:", entityType);
      const response = await axios.put(`http://localhost:5000/admin/${entityType}/${id}`, entity);
      console.log("Update response:", response.data);
      toast.success("Entity updated successfully!");
      setTimeout(() => {
        navigate(-1); // Go back to the previous page after showing success message
      }, 2000);
    } catch (error) {
      console.error("Error editing entity:", error);
      toast.error(`Failed to update: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderFormFields = () => {
    const inputClass = "w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary";
    const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

    switch (entityType) {
      case "customers":
        return (
          <>
            <div className="mb-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <label htmlFor="Name" className={labelClass}>Name</label>
              <input type="text" id="Name" name="Name" value={entity.Name || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className={labelClass}>Username</label>
              <input type="text" id="username" name="username" value={entity.username || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="gmail" className={labelClass}>Email</label>
              <input type="email" id="gmail" name="gmail" value={entity.gmail || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="phno" className={labelClass}>Phone Number</label>
              <input type="text" id="phno" name="phno" value={entity.phno || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className={labelClass}>Role</label>
              <input type="text" id="role" name="role" value={entity.role || ""} onChange={handleChange} className={inputClass} readOnly />
            </div>
          </>
        );
      case "packages":
        return (
          <>
            <div className="mb-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <label htmlFor="name" className={labelClass}>Package Name</label>
              <input type="text" id="name" name="name" value={entity.name || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea id="description" name="description" value={entity.description || ""} onChange={handleChange} className={`${inputClass} h-24`}></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="price" className={labelClass}>Price</label>
              <input type="number" id="price" name="price" value={entity.price || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className={labelClass}>Duration (days)</label>
              <input type="number" id="duration" name="duration" value={entity.duration || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className={labelClass}>Location</label>
              <input type="text" id="location" name="location" value={entity.location || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="maxGroupSize" className={labelClass}>Max Group Size</label>
              <input type="number" id="maxGroupSize" name="maxGroupSize" value={entity.maxGroupSize || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="isActive" className={labelClass}>Status</label>
              <select id="isActive" name="isActive" value={entity.isActive || "pending"} onChange={handleChange} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </>
        );
      case "guides":
        return (
          <>
            <div className="mb-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <label htmlFor="name" className={labelClass}>Name</label>
              <input type="text" id="name" name="name" value={entity.name || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className={labelClass}>Username</label>
              <input type="text" id="username" name="username" value={entity.username || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="gmail" className={labelClass}>Email</label>
              <input type="email" id="gmail" name="gmail" value={entity.gmail || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="phno" className={labelClass}>Phone Number</label>
              <input type="text" id="phno" name="phno" value={entity.phno || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="experience" className={labelClass}>Experience (years)</label>
              <input type="number" id="experience" name="experience" value={entity.experience || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="languages" className={labelClass}>Languages</label>
              <input type="text" id="languages" name="languages" value={entity.languages || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className={labelClass}>Location</label>
              <input type="text" id="location" name="location" value={entity.location || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="specialization" className={labelClass}>Specialization</label>
              <select id="specialization" name="specialization" value={entity.specialization || ""} onChange={handleChange} className={inputClass}>
                <option value="luxury">Luxury</option>
                <option value="adventure">Adventure</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="budget-friendly">Budget-Friendly</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );
      case "bookings":
        return (
          <>
            <div className="mb-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <label htmlFor="totalPrice" className={labelClass}>Total Price</label>
              <input type="number" id="totalPrice" name="totalPrice" value={entity.totalPrice || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" name="status" value={entity.status || "pending"} onChange={handleChange} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="paymentStatus" className={labelClass}>Payment Status</label>
              <select id="paymentStatus" name="paymentStatus" value={entity.paymentStatus || "pending"} onChange={handleChange} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </>
        );
      case "agency":
        return (
          <>
            <div className="mb-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <label htmlFor="name" className={labelClass}>Agency Name</label>
              <input type="text" id="name" name="name" value={entity.name || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className={labelClass}>Username</label>
              <input type="text" id="username" name="username" value={entity.username || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="gmail" className={labelClass}>Email</label>
              <input type="email" id="gmail" name="gmail" value={entity.gmail || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="contactInfo.email" className={labelClass}>Contact Email</label>
              <input type="email" id="contactInfo.email" name="contactInfo.email" value={entity.contactInfo?.email || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="phno" className={labelClass}>Phone Number</label>
              <input type="text" id="phno" name="phno" value={entity.phno || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="contactInfo.phone" className={labelClass}>Contact Phone</label>
              <input type="text" id="contactInfo.phone" name="contactInfo.phone" value={entity.contactInfo?.phone || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="bio" className={labelClass}>Bio</label>
              <textarea id="bio" name="bio" value={entity.bio || ""} onChange={handleChange} className={`${inputClass} h-24`}></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="specialization" className={labelClass}>Specialization</label>
              <select id="specialization" name="specialization" value={entity.specialization || ""} onChange={handleChange} className={inputClass}>
                <option value="luxury">Luxury</option>
                <option value="adventure">Adventure</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="budget-friendly">Budget-Friendly</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );
      case "reviews":
        return (
          <>
            <div className="mb-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <label htmlFor="rating" className={labelClass}>Rating</label>
              <input type="number" id="rating" name="rating" value={entity.rating || ""} onChange={handleChange} min={1} max={5} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className={labelClass}>Comment</label>
              <textarea id="comment" name="comment" value={entity.comment || ""} onChange={handleChange} className={`${inputClass} h-24`}></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" name="status" value={entity.status || ""} onChange={handleChange} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </>
        );
      default:
        return (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
            <p>No edit form available for this entity type: {entityType}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-2xl mx-auto">
        <BackButton className="mb-6 inline-flex items-center px-4 py-2 rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out" />
        <div className="bg-card shadow-xl rounded-lg overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h1 className="text-2xl font-bold text-primary-foreground">
              Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            </h1>
          </div>
          <div className="px-6 py-4 space-y-4">
            {renderFormFields()}
            <button
              onClick={handleEditEntity}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEntity;

