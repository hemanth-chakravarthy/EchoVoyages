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
          <h1 className="text-3xl font-bold text-white tracking-tight">Agent Profile</h1>
        </div>
        <div className="px-6 py-8">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
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
