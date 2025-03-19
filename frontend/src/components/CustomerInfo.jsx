import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";


const CustomerInfo = () => {
  const [bookings, setBookings] = useState([]);
  const [customer, setCustomer] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");
  const id = token ? jwtDecode(token).id : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/customers/${id}`
        );
        setCustomer(response.data);
      } catch (error) {
        toast.error("Error fetching customer details");
        console.log(error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const bookingsResponse = await axios.get(
          `http://localhost:5000/bookings/cust/${id}`
        );
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (id) {
      fetchCustomer();
      fetchBookingsData();
    }
  }, [id]);

  const validateForm = () => {
    let formErrors = {};

    if (!/^[a-zA-Z0-9._]+$/.test(customer.username)) {
      formErrors.username =
        "Username should only contain letters, numbers, underscores, and dots.";
    }

    if (!/^[a-zA-Z\s]+$/.test(customer.name)) {
      formErrors.name = "Name should only contain letters and spaces.";
    }

    if (!/^\d{10}$/.test(customer.phno)) {
      formErrors.phoneNumber = "Phone number should be a 10-digit number.";
    }

    if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(customer.gmail)) {
      formErrors.email = "Email is not valid.";
    }

    if (changePassword) {
      if (
        !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          newPassword
        )
      ) {
        formErrors.newPassword =
          "Password must be at least 6 characters long, include a number, a special character, and an uppercase letter.";
      }
      if (newPassword !== confirmPassword) {
        formErrors.confirmPassword =
          "New password and confirmation password do not match.";
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleEditToggle = () => setEditing(!editing);
  const handlePasswordToggle = () => setChangePassword(!changePassword);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
  };

  const handleUpdateCustomer = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/customers/${id}`, customer);
      toast.success("Customer details updated successfully");
      setEditing(false);
      navigate("/custProfilePage");
    } catch (error) {
      toast.error("Error occurred while updating customer details");
      console.log(error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/customers/${id}/update-password`, {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully");
      setChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Incorrect current password.");
      } else {
        toast.error("Error updating password. Please try again later.");
      }
      console.log(error);
    }
  };

  return (

      <motion.main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        <ToastContainer position="top-right" autoClose={3000} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="./images/empty-profile-pic.png"
                alt="Profile"
                className="w-48 h-48 rounded-full mx-auto shadow-lg border-4 border-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditToggle}
                className="w-full mt-6 bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full mt-4 bg-red-600 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                Logout
              </motion.button>
            </div>

            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-8">Customer Details</h2>
              
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2d3748] mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={customer.Name || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d3748] mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={customer.username || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d3748] mb-2">Phone Number</label>
                    <input
                      type="text"
                      name="phno"
                      value={customer.phno || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d3748] mb-2">Email</label>
                    <input
                      type="text"
                      name="gmail"
                      value={customer.gmail || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 text-[#2d3748]">
                  {["Name", "username", "phno", "gmail"].map((field) => (
                    <motion.div 
                      key={field} 
                      className="flex flex-col p-4 rounded-lg bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-sm text-[#1a365d] font-medium mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                      <span className="text-lg">{customer[field] || "N/A"}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Previous Bookings Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight">Previous Bookings</h2>
                  <select
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[#1a365d]
                      shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1] 
                      hover:border-[#4169E1]/30 transition-all duration-200"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {bookings.length > 0 ? (
                    bookings
                      .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
                      .map((booking) => (
                      <motion.div
                        key={booking._id}
                        whileHover={{ 
                          x: 4,
                          boxShadow: "0 12px 25px -12px rgba(26, 54, 93, 0.15)"
                        }}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-100"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-[#1a365d] mb-2">
                              {booking.packageName || "N/A"}
                            </h3>
                            <div className="text-[#2d3748] space-y-1">
                              <p><span className="font-medium">Guide:</span> {booking.guideName || "N/A"}</p>
                              <p><span className="font-medium">Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                              <p><span className="font-medium">ID:</span> {booking._id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#1a365d]">₹{booking.totalPrice}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-xl text-[#2d3748]">No previous bookings available.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.main>

  );
};

export default CustomerInfo;

