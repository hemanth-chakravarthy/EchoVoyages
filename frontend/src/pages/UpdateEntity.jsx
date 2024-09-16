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
      <h1>Edit {entityType === 'customers' ? 'User' : 'Package'}</h1>
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
        ) : (
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
        )}
        <button onClick={handleEditEntity}>
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateEntity;
