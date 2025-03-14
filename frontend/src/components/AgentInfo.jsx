import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AgentInfo = () => {
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [agent, setAgent] = useState({ contactInfo: {} });
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const id = token ? jwtDecode(token).id : null;
  const navigate = useNavigate();
  const specializations = ["luxury", "adventure", "business", "family", "other"];

  const totalAmountEarned = bookings.reduce((total, booking) => total + booking.price, 0);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/agency/${id}`);
        setAgent(response.data);
      } catch (error) {
        toast.error("Error fetching agent details");
        console.log(error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/packages/agents/${id}`);
        const packagesWithCounts = await Promise.all(
          response.data.map(async (pkg) => {
            const bookingCount = await fetchBookingCount(pkg._id);
            return { name: pkg.name, count: bookingCount };
          })
        );
        setBookings(response.data);
        setChartData(packagesWithCounts);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchAgent();
    fetchBookingsData();
  }, [id]);

  const fetchBookingCount = async (packageId) => {
    try {
      const response = await axios.get(`http://localhost:5000/bookings/pack/${packageId}`);
      return response.data.length;
    } catch (error) {
      console.error("Error fetching booking count:", error);
      return 0;
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setErrors({});
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgent((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!agent.name) newErrors.name = "Name is required";
    if (!agent.username) newErrors.username = "Username is required";
    if (!agent.specialization) newErrors.specialization = "Specialization is required";
    if (!agent.contactInfo?.phone) newErrors.phone = "Phone number is required";
    if (!agent.contactInfo?.email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateAgent = async () => {
    if (validateForm()) {
      try {
        await axios.put(`http://localhost:5000/agency/${id}`, agent);
        toast.success("Agent details updated successfully");
        navigate("/AgentProfilePage");
      } catch (error) {
        toast.error("Error occurred while updating agent details");
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="rounded-lg shadow-xl overflow-hidden bg-white">
  <div className="px-6 py-5 bg-[#1a365d] border-b border-gray-100">
    <h1 className="text-3xl font-bold text-white tracking-tight">
      Edit Agent Details
    </h1>
  </div>
  <div className="px-6 py-8">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3 mb-6 md:mb-0">
        <div className="text-center">
          <img
            src={"./images/empty-profile-pic.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-[#4169E1]/20"
          />
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="md:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1a365d]">Agent Profile</h2>
          <button
            onClick={handleEditToggle}
            className="px-6 py-2 bg-[#4169E1] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300 transform hover:scale-105"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
        {editing ? (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-[#2d3748] mb-1">
        Name
      </label>
      <input
        type="text"
        name="name"
        value={agent.name || ""}
        onChange={handleChange}
        className="w-full text-black bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1] transition-all"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-[#2d3748] mb-1">
        Username
      </label>
      <input
        type="text"
        name="username"
        value={agent.username || ""}
        onChange={handleChange}
        className="w-full px-4 text-black bg-gray-50 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1] transition-all"
      />
      {errors.username && (
        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-[#2d3748] mb-1">
        Specialization
      </label>
      <select
        name="specialization"
        value={agent.specialization || ""}
        onChange={handleChange}
        className="w-full text-black bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1] transition-all"
      >
        <option value="">Select Specialization</option>
        {specializations.map((specialization) => (
          <option key={specialization} value={specialization}>
            {specialization.charAt(0).toUpperCase() + specialization.slice(1)}
          </option>
        ))}
      </select>
      {errors.specialization && (
        <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-[#2d3748] mb-1">
        Bio
      </label>
      <textarea
        name="bio"
        value={agent.bio || ""}
        onChange={handleChange}
        className="w-full text-black bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1] transition-all"
      />
      {errors.bio && (
        <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-[#2d3748] mb-1">
        Phone
      </label>
      <input
        type="text"
        name="phone"
        value={agent.contactInfo?.phone || ""}
        onChange={(e) => {
          setAgent((prevAgent) => ({
            ...prevAgent,
            contactInfo: {
              ...prevAgent.contactInfo,
              phone: e.target.value,
            },
          }));
          setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
        }}
        className="w-full text-black bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1] transition-all"
      />
      {errors.phone && (
        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-[#2d3748] mb-1">
        Email
      </label>
      <input
        type="email"
        name="email"
        value={agent.contactInfo?.email || ""}
        onChange={(e) => {
          setAgent((prevAgent) => ({
            ...prevAgent,
            contactInfo: {
              ...prevAgent.contactInfo,
              email: e.target.value,
            },
          }));
          setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        }}
        className="w-full text-black bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1] transition-all"
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
      )}
    </div>
    <button
      onClick={handleUpdateAgent}
      className="w-full px-6 py-3 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300 transform hover:scale-105"
    >
      Save Changes
    </button>
  </div>
) : (
  // Display section
  <div className="space-y-4">
    {["name", "username", "specialization", "bio"].map((field) => (
      <div key={field} className="flex border-b border-gray-100 py-3">
        <span className="font-medium w-1/3 text-[#1a365d]">
          {field.charAt(0).toUpperCase() + field.slice(1)}:
        </span>
        <span className="text-[#2d3748]">{agent[field] || "N/A"}</span>
      </div>
    ))}
    <div className="flex border-b border-gray-100 py-3">
      <span className="font-medium w-1/3 text-[#1a365d]">Phone:</span>
      <span className="text-[#2d3748]">
        {agent.contactInfo?.phone || "N/A"}
      </span>
    </div>
    <div className="flex border-b border-gray-100 py-3">
      <span className="font-medium w-1/3 text-[#1a365d]">Email:</span>
      <span className="text-[#2d3748]">
        {agent.contactInfo?.email || "N/A"}
      </span>
    </div>
  </div>
)}

      </div>
    </div>
  </div>
</div>


    
      <div className="mt-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="px-4 py-5 sm:px-6 bg-[#1a365d]">
          <h2 className="text-xl font-semibold text-white">Previous Bookings</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-lg font-semibold text-[#2d3748]">
            Total Amount Earned: <span className="text-green-600">Rs. {totalAmountEarned} </span>
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#2d3748" />
              <YAxis stroke="#2d3748" />
              <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #ddd" }} />
              <Legend wrapperStyle={{ color: "#2d3748" }} />
              <Bar dataKey="count" fill="#00072D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
