import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEntity = () => {
  const [entity, setEntity] = useState({});
  const { id, entityType } = useParams(); // Extract 'id' and 'entityType' from the URL
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the entity based on the entityType
    axios.get(`http://localhost:5000/admin/${entityType}/${id}`)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((error) => {
        alert('Error occurred while fetching data');
        console.log(error);
      });
  }, [id, entityType]);

  // Handle form submission
  const handleEditEntity = () => {
    axios.put(`http://localhost:5000/admin/${entityType}/${id}`, entity)
      .then(() => {
        navigate(`/admin`);
      })
      .catch((error) => {
        alert('Error occurred while updating');
        console.log(error);
      });
  };

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity((prevEntity) => ({
      ...prevEntity,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Edit {entityType === 'customers' ? 'Customers' : entityType === 'packages' ? 'Packages' : entityType === 'guides' ? 'Guides' : 'Reviews'}</h1>
      <div>
        {/* Conditionally render form fields based on entityType */}
        {entityType === 'customers' ? (
          <>
            <label>Name</label>
            <input
              type="text"
              name="Name"
              value={entity.Name || ''}
              onChange={handleChange}
            />
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={entity.username || ''}
              onChange={handleChange}
            />
            <label>Gmail</label>
            <input
              type="text"
              name="gmail"
              value={entity.gmail || ''}
              onChange={handleChange}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={entity.password || ''}
              onChange={handleChange}
            />
          </>
        ) : entityType === 'packages' ? (
          <>
            <label>Package Name</label>
            <input
              type="text"
              name="name"
              value={entity.name || ''}
              onChange={handleChange}
            />
            <label>Description</label>
            <textarea
              name="description"
              value={entity.description || ''}
              onChange={handleChange}
            />
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={entity.price || ''}
              onChange={handleChange}
            />
          </>
        ) : entityType === 'guides' ? (
          <>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={entity.name || ''}
              onChange={handleChange}
            />
            <label>Experience</label>
            <input
              type="number"
              name="experience"
              value={entity.experience || ''}
              onChange={handleChange}
            />
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={entity.contact?.email || ''}
              onChange={handleChange}
            />
            <label>Languages</label>
            <input
              type="text"
              name="languages"
              value={entity.languages || ''}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              value={entity.rating || ''}
              onChange={handleChange}
              min={1}
              max={5}
            />
            <label>Comment</label>
            <textarea
              name="comment"
              value={entity.comment || ''}
              onChange={handleChange}
            />
            <label>Status</label>
            <select
              name="status"
              value={entity.status || 'pending'}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </>
        )}
        <button onClick={handleEditEntity}>
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateEntity;
