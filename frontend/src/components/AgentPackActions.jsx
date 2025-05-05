/** @format */

import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import apiUrl from "../utils/api.js";

const AgentPackActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("pending");
  const { id } = useParams();

  console.log("AgentPackActions: Rendering with package ID:", id);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleOpenModal = async () => {
    setShowModal(true);
    try {
      const packageResponse = await axios.get(`${apiUrl}/packages/${id}`);
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
      const response = await axios.put(`${apiUrl}/packages/${id}`, updatedData);
      notifySuccess(response.data.message);
      setShowModal(false);
    } catch (error) {
      notifyError("Error updating the package");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/packages/${id}`);
      notifySuccess(response.data.message);
    } catch (error) {
      notifyError("Error deleting the package");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-lg border border-gray-100"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-[#4169E1] text-white font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={handleOpenModal}
        >
          Update Package
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-[#00072D] text-white font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={handleDelete}
        >
          Delete Package
        </motion.button>
      </div>

      <dialog id="my_modal_3" className="modal" open={showModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="modal-box bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight">
              Update Package
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="text-[#2d3748] hover:text-[#1a365d]"
              onClick={() => setShowModal(false)}
            >
              ✕
            </motion.button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="text-[#1a365d] font-medium mb-2 block">
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="text-[#1a365d] font-medium mb-2 block">
                Price:
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="text-[#1a365d] font-medium mb-2 block">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 transition-all duration-300 min-h-[120px]"
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 bg-[#4169E1] text-white font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowModal(false)}
                className="px-8 py-3 bg-[#00072D] text-white font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </dialog>
    </motion.div>
  );
};

export default AgentPackActions;
