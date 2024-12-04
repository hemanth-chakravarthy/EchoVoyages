import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const UpdateEntity = () => {
  const [entity, setEntity] = useState({});
  const [entityType, setEntityType] = useState(""); // Add state for entity type

  const navigate = useNavigate();
  const { id, type } = useParams(); // Assuming you're using useParams for id and type

  useEffect(() => {
    // Fetch entity data based on id and type
    const fetchEntity = async () => {
      try {
        const response = await axios.get(`/api/${type}/${id}`); // Replace with your API endpoint
        setEntity(response.data);
        setEntityType(type);
      } catch (error) {
        console.error("Error fetching entity:", error);
      }
    };

    if (id && type) {
      fetchEntity();
    }
  }, [id, type]);


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
      await axios.put(`/api/${entityType}/${id}`, entity); // Replace with your API endpoint
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error editing entity:", error);
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
              <label htmlFor="name" className={labelClass}>Name</label>
              <input type="text" id="name" name="name" value={entity.name || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className={labelClass}>Username</label>
              <input type="text" id="username" name="username" value={entity.username || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="gmail" className={labelClass}>Gmail</label>
              <input type="email" id="gmail" name="gmail" value={entity.gmail || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className={labelClass}>Password</label>
              <input type="password" id="password" name="password" value={entity.password || ""} onChange={handleChange} className={inputClass} />
            </div>
          </>
        );
      case "packages":
        return (
          <>
            <div className="mb-4">
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
          </>
        );
      case "guides":
        return (
          <>
            <div className="mb-4">
              <label htmlFor="name" className={labelClass}>Name</label>
              <input type="text" id="name" name="name" value={entity.name || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="experience" className={labelClass}>Experience</label>
              <input type="number" id="experience" name="experience" value={entity.experience || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input type="email" id="email" name="email" value={entity.email || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="languages" className={labelClass}>Languages</label>
              <input type="text" id="languages" name="languages" value={entity.languages || ""} onChange={handleChange} className={inputClass} />
            </div>
          </>
        );
      case "bookings":
        return (
          <div className="mb-4">
            <label htmlFor="totalPrice" className={labelClass}>Total Price</label>
            <input type="number" id="totalPrice" name="totalPrice" value={entity.totalPrice || ""} onChange={handleChange} className={inputClass} />
          </div>
        );
      case "agency":
        return (
          <>
            <div className="mb-4">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input type="email" id="email" name="contactInfo.email" value={entity.contactInfo?.email || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input type="text" id="phone" name="contactInfo.phone" value={entity.contactInfo?.phone || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-4">
              <label htmlFor="specialization" className={labelClass}>Specialization</label>
              <select id="specialization" name="specialization" value={entity.specialization || ""} onChange={handleChange} className={inputClass}>
                <option value="luxury">Luxury</option>
                <option value="adventure">Adventure</option>
                <option value="business">Business</option>
                <option value="family">Family</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="mb-4">
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
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
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

