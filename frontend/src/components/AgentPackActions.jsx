import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgentPackActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("pending");
  const { id } = useParams();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleOpenModal = async () => {
    setShowModal(true);
    try {
      const packageResponse = await axios.get(
        `http://localhost:5000/packages/${id}`
      );
      const { name, price, description, isActive } = packageResponse.data;
      setName(name);
      setPrice(price);
      setDescription(description);
      setIsActive(isActive);
    } catch (error) {
      notifyError("Error fetching package details");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { name, price, description, isActive };
      const response = await axios.put(
        `http://localhost:5000/packages/${id}`,
        updatedData
      );
      notifySuccess(response.data.message);
      setShowModal(false);
    } catch (error) {
      notifyError("Error updating the package");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/packages/${id}`
      );
      notifySuccess(response.data.message);
    } catch (error) {
      notifyError("Error deleting the package");
    }
  };

  return (
    <div className="p-4 bg-base-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <button
        className="bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
        onClick={handleOpenModal}
      >
        Update Package
      </button>
      <button
        className="bg-transparent text-transparent font-bold mx-4 py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
        onClick={handleDelete}
      >
        Delete Package
      </button>
      <dialog id="my_modal_3" className="modal" open={showModal}>
        <div className="modal-box">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </form>
          <h2 className="font-bold text-xl mb-4">Update Package</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price:
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AgentPackActions;
