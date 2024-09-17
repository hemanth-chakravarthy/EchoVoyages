import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';

const DeleteEntity = () => {
    const navigate = useNavigate();
    const { id, entity } = useParams(); // Extract 'entity' from URL params
    const [entityType, setEntityType] = useState(entity || 'customers'); // Default to 'customers'

    const handleDelete = () => {
        axios
            .delete(`http://localhost:5000/admin/${entityType}/${id}`)
            .then(() => {
                navigate(`/admin`);
            })
            .catch((error) => {
                alert('An error occurred while deleting the entity');
                console.log(error);
            });
    };

    return (
        <div>
            <BackButton />
            <h1>Delete {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h1>
            <div>
                <h3>Are you sure you want to delete this {entityType.slice(0, -1)}?</h3>
                <button onClick={handleDelete}>Yes, Delete it</button>
            </div>
        </div>
    );
};

export default DeleteEntity;
