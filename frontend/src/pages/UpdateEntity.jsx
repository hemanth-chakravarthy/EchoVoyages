import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
const UpdateEntity = () => {
  const [entity, setEntity] = useState({});
  const { id, entityType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/${entityType}/${id}`)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((error) => {
        alert("Error occurred while fetching data");
        console.log(error);
      });
  }, [id, entityType]);

  const handleEditEntity = () => {
    axios
      .put(`http://localhost:5000/admin/${entityType}/${id}`, entity)
      .then(() => {
        navigate(`/admin`);
      })
      .catch((error) => {
        alert("Error occurred while updating");
        console.log(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity((prevEntity) => ({
      ...prevEntity,
      [name]: value,
    }));
  };

  return (
    <div className="update-container">
      <BackButton className="back-button" />
      <h1 className="title">
        Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
      </h1>
      <div className="update-card">
        {/* Conditionally render form fields based on entityType */}
        {entityType === "customers" ? (
          <>
            <label>Name</label>
            <input
              type="text"
              name="Name"
              value={entity.Name || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={entity.username || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Gmail</label>
            <input
              type="text"
              name="gmail"
              value={entity.gmail || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={entity.password || ""}
              onChange={handleChange}
              className="input-field"
            />
          </>
        ) : entityType === "packages" ? (
          <>
            <label>Package Name</label>
            <input
              type="text"
              name="name"
              value={entity.name || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Description</label>
            <textarea
              name="description"
              value={entity.description || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={entity.price || ""}
              onChange={handleChange}
              className="input-field"
            />
          </>
        ) : entityType === "guides" ? (
          <>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={entity.name || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Experience</label>
            <input
              type="number"
              name="experience"
              value={entity.experience || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={entity.contact?.email || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Languages</label>
            <input
              type="text"
              name="languages"
              value={entity.languages || ""}
              onChange={handleChange}
              className="input-field"
            />
          </>
        ) : entityType === "bookings" ? (
          <>
            <label>Total Price</label>
            <input
              type="number"
              name="totalPrice"
              value={entity.totalPrice || ""}
              onChange={handleChange}
              className="input-field"
            />
          </>
        ) : entityType === "agency" ? (
          <>
            <label>Email</label>
            <input
              type="text"
              name="contactInfo.email"
              value={entity.contactInfo?.email || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Phone</label>
            <input
              type="text"
              name="contactInfo.phone"
              value={entity.contactInfo?.phone || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Specialization</label>
            <select
              name="specialization"
              value={entity.specialization || ""}
              onChange={handleChange}
              className="input-field"
            >
              <option value="luxury">Luxury</option>
              <option value="adventure">Adventure</option>
              <option value="business">Business</option>
              <option value="family">Family</option>
              <option value="other">Other</option>
            </select>
          </>
        ) : (
          <>
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              value={entity.rating || ""}
              onChange={handleChange}
              min={1}
              max={5}
              className="input-field"
            />
            <label>Comment</label>
            <textarea
              name="comment"
              value={entity.comment || ""}
              onChange={handleChange}
              className="input-field"
            />
            <label>Status</label>
            <select
              name="status"
              value={entity.status || "pending"}
              onChange={handleChange}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </>
        )}
        <button onClick={handleEditEntity} className="save-button">
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateEntity;
