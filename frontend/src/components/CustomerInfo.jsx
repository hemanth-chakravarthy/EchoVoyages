import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CustomerInfo = () => {
  const [bookings, setBookings] = useState([]);
  const [customer, setCustomer] = useState({});
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
        alert("Error fetching customer details");
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
      alert("Customer details updated successfully");
      setEditing(false);
      navigate("/custProfilePage");
    } catch (error) {
      alert("Error occurred while updating customer details");
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
      alert("Password updated successfully");
      setChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Incorrect current password.");
      } else {
        alert("Error updating password. Please try again later.");
      }
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-16">Customer Profile</h1>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <img
              src="./images/empty-profile-pic.png"
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8"
            />
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-semibold">Customer Details</h2>
                <div>
                  <button
                    onClick={handleEditToggle}
                    className="bg-transparent text-transparent font-bold py-2 px-4 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
                  >
                    {editing ? "Cancel" : "Edit Profile"}
                  </button>
                  
                </div>
              </div>
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={customer.Name || ""}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={customer.username || ""}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phno"
                      value={customer.phno || ""}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="text"
                      name="gmail"
                      value={customer.gmail || ""}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Name", "username", "phno", "gmail"].map((field) => (
                    <div key={field} className="mb-2">
                      <span className="font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>{" "}
                      <span>{customer[field] || "N/A"}</span>
                    </div>
                  ))}
                </div>
              )}
              {editing && (
                <button
                  onClick={handleUpdateCustomer}
                  className="bg-transparent text-transparent font-bold py-2 px-4 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
                >
                  Save Changes
                </button>
              )}
              {changePassword && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-700 rounded-md py-2 px-3"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <div>
                    <button
                      onClick={handleUpdatePassword}
                      className="mt-6 bg-transparent text-transparent font-bold py-2 px-4 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-semibold mb-4">Previous Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 transition-all duration-300 hover:scale-105">
                    <h3 className="text-xl font-semibold mb-2">Package: {booking.packageName || "N/A"}</h3>
                    <p><strong>Guide Name:</strong> {booking.guideName || "N/A"}</p>
                    <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-xl text-gray-300">No previous bookings available.</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default CustomerInfo;

