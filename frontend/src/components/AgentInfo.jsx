import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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
  const [editing, setEditing] = useState(false);
  const [agent, setAgent] = useState({});
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const id = token ? jwtDecode(token).id : null;
  const AgentID = id;
  const navigate = useNavigate();
  const specializations = [
    "luxury",
    "adventure",
    "business",
    "family",
    "other",
  ];

  const totalAmountEarned = bookings.reduce(
    (total, booking) => total + booking.price,
    0
  );

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/agency/${id}`);
        setAgent(response.data);
      } catch (error) {
        alert("Error fetching agent details");
        console.log(error);
      }
    };
    const fetchBookingsData = async () => {
      try {
        const bookingsResponse = await axios.get(
          `http://localhost:5000/packages/agents/${AgentID}`
        );
        console.log("Bookings Response:", bookingsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error(
          "Error fetching bookings:",
          error.response ? error.response.data : error
        );
      }
    };
    fetchAgent();
    fetchBookingsData();
  }, [id, AgentID]);

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
    setAgent((prevAgent) => ({
      ...prevAgent,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!agent.name) newErrors.name = "Name is required";
    if (!agent.username) newErrors.username = "Username is required";
    if (!agent.contactInfo?.phone) newErrors.phone = "Phone number is required";
    if (!agent.contactInfo?.email) newErrors.email = "Email is required";
    if (!agent.specialization)
      newErrors.specialization = "Specialization is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateAgent = async () => {
    if (validateForm()) {
      try {
        await axios.put(`http://localhost:5000/agency/${id}`, agent);
        alert("Agent details updated successfully");
        navigate("/AgentProfilePage");
      } catch (error) {
        alert("Error occurred while updating agent details");
        console.log(error);
      }
    }
  };

  const chartData = bookings.reduce((acc, booking) => {
    const existingPackage = acc.find((item) => item.name === booking.name);
    if (existingPackage) {
      existingPackage.count += 1;
    } else {
      acc.push({ name: booking.name, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-base-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-base-200 rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-base200">
          <h1 className="text-2xl font-bold text-primary">
            Edit Agent Details
          </h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="text-center">
                <img
                  src={"./images/empty-profile-pic.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">
                  Agent Profile
                </h2>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={agent.name || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={agent.username || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={agent.contactInfo?.phone || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={agent.contactInfo?.email || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={agent.specialization || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Select Specialization</option>
                      {specializations.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.specialization}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={agent.bio || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={handleUpdateAgent}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {["name", "username", "specialization", "bio"].map(
                    (field) => (
                      <div key={field} className="flex">
                        <span className="font-medium w-1/3">
                          {field.charAt(0).toUpperCase() + field.slice(1)}:
                        </span>
                        <span>{agent[field] || "N/A"}</span>
                      </div>
                    )
                  )}
                  <div className="flex">
                    <span className="font-medium w-1/3">Phone:</span>
                    <span>{agent.contactInfo?.phone || "N/A"}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-1/3">Email:</span>
                    <span>{agent.contactInfo?.email || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-4xl mx-auto bg-base-200 rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-base-300">
          <h2 className="text-xl font-semibold text-gray-900">
            Previous Bookings
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <p className="text-lg font-semibold">
              Total Amount Earned:{" "}
              <span className="text-green-600">Rs. {totalAmountEarned}</span>
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Bookings per Package</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-base-100 p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {booking.name || "N/A"}
                  </h3>
                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="font-medium">Rs. {booking.price}</span>
                  </p>
                  <p className="text-gray-600">
                    Date:{" "}
                    <span className="font-medium">
                      {new Date(booking.availableDates).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No previous bookings available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
