/** @format */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ProfileEditor() {
  const [customer, setCustomer] = useState({});
  const [editing, setEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate();

  // Get user ID from token
  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const id = getUserId();

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/customers/${id}`
        );
        setCustomer(response.data);

        // Set preview URL if profile picture exists
        if (response.data.profilePicture) {
          setPreviewUrl(
            `http://localhost:5000/${response.data.profilePicture}`
          );
        }
      } catch (error) {
        toast.error("Error fetching customer details");
        console.log(error);
      }
    };

    fetchCustomer();
  }, [id]);

  const validateForm = () => {
    const formErrors = {};

    if (customer.username && !/^[a-zA-Z0-9._]+$/.test(customer.username)) {
      formErrors.username =
        "Username should only contain letters, numbers, underscores, and dots.";
    }

    if (customer.Name && !/^[a-zA-Z\s]+$/.test(customer.Name)) {
      formErrors.name = "Name should only contain letters and spaces.";
    }

    if (customer.phno && !/^\d{10}$/.test(customer.phno)) {
      formErrors.phoneNumber = "Phone number should be a 10-digit number.";
    }

    if (
      customer.gmail &&
      !/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(customer.gmail)
    ) {
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

    if (
      profileImage &&
      !["image/jpeg", "image/png", "image/gif"].includes(profileImage.type)
    ) {
      formErrors.profilePicture =
        "Please upload a valid image file (JPEG, PNG, or GIF).";
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();

      // Append customer data
      if (customer.Name) formData.append("Name", customer.Name);
      if (customer.username) formData.append("username", customer.username);
      if (customer.phno) formData.append("phno", customer.phno);
      if (customer.gmail) formData.append("gmail", customer.gmail);
      if (customer.specialization)
        formData.append("specialization", customer.specialization);

      // Append profile picture if selected
      if (profileImage) {
        formData.append("profilePicture", profileImage);
      }

      await axios.put(`http://localhost:5000/customers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error("Error occurred while updating profile");
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
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={previewUrl || "/images/empty-profile-pic.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {editing && (
              <div className="mt-4">
                <label
                  htmlFor="profile-picture"
                  className="block mb-2 text-sm font-medium"
                >
                  Profile Picture
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.profilePicture && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profilePicture}
                  </p>
                )}
              </div>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <button
              onClick={handleEditToggle}
              className="w-full mt-2 bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </motion.div>

          {editing && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4"
            >
              <button
                onClick={handlePasswordToggle}
                className="w-full bg-[#4169E1] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#3154b3] transition-all duration-300 shadow-md"
              >
                {changePassword ? "Cancel Password Change" : "Change Password"}
              </button>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4"
          >
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
            >
              Logout
            </button>
          </motion.div>
        </div>
      </div>

      <div className="md:w-2/3">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#1a365d] mb-8">
              Customer Details
            </h2>

            {editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="Name"
                      value={customer.Name || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={customer.username || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phno"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phno"
                      type="text"
                      name="phno"
                      value={customer.phno || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="gmail"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="gmail"
                      type="email"
                      name="gmail"
                      value={customer.gmail || ""}
                      onChange={handleChange}
                      className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {changePassword && (
                  <div className="mt-8 space-y-6 border-t pt-6">
                    <h3 className="text-xl font-bold text-[#1a365d]">
                      Change Password
                    </h3>

                    <div>
                      <label
                        htmlFor="current-password"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="new-password"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleUpdatePassword}
                      className="mt-4 bg-[#00072D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                    >
                      Update Password
                    </button>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleUpdateCustomer}
                    className="bg-[#00072D] text-white font-semibold py-3 px-8 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
