import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const DeleteEntity = () => {
  const navigate = useNavigate();
  const { id, entity } = useParams();
  const [entityType, setEntityType] = useState(entity || "customers");

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/admin/${entityType}/${id}`)
      .then(() => {
        navigate(`/admin`);
      })
      .catch((error) => {
        alert("An error occurred while deleting the entity");
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <BackButton className="mb-6 inline-flex items-center px-4 py-2 rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out" />
        <div className="bg-card shadow-xl rounded-lg overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h1 className="text-2xl font-bold text-primary-foreground">
              Delete {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            </h1>
          </div>
          <div className="px-6 py-4 space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Are you sure you want to delete this {entityType.slice(0, -1)}?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Yes, Delete it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEntity;

