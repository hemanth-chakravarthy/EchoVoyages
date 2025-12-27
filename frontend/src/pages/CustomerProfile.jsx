/** @format */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaSuitcase,
  FaCalendarAlt,
  FaUserTie,
  FaIdCard,
  FaEdit,
  FaSave,
  FaTimes,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaSignOutAlt,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Profile editing states
  const [editing, setEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const getUserId = () => {
    if (typeof window === "undefined") return null;
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
    const fetchData = async () => {
      if (!id) {
        window.location.href = "/login";
        return;
      }

      setLoading(true);
      try {
        const customerResponse = await axios.get(`${apiUrl}/customers/${id}`);
        setCustomer(customerResponse.data);

        // Set preview URL if profile picture exists
        if (customerResponse.data.profilePicture) {
          setPreviewUrl(`${apiUrl}/${customerResponse.data.profilePicture}`);
        }

        const bookingsResponse = await axios.get(
          `${apiUrl}/bookings/cust/${id}`
        );
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Profile editing functions
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
  const handlePasswordToggle = () => {
    setChangePassword(!changePassword);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
      await axios.put(`${apiUrl}/customers/${id}`, formData, {
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
      await axios.put(`${apiUrl}/customers/${id}/update-password`, {
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
    <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#38434f] font-medium">
                Loading profile data...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar with Profile Information */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative">
                  <div className="h-24 bg-gradient-to-r from-[#0a66c2] to-[#004182]"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-[#e9e5df] flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={customer.Name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-[#56687a] text-4xl" />
                        )}
                      </div>
                      {editing && (
                        <label
                          htmlFor="profile-upload"
                          className="absolute bottom-0 right-0 bg-[#0a66c2] text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-[#004182] transition-colors"
                        >
                          <FaCamera className="text-sm" />
                          <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-16 px-4 pb-4 text-center">
                  <h1 className="text-xl font-bold text-[#38434f]">
                    {customer?.Name || "Customer"}
                  </h1>
                  <p className="text-[#56687a] text-sm">
                    {customer?.gmail || "No email available"}
                  </p>

                  {!editing && !changePassword && (
                    <button
                      onClick={handleEditToggle}
                      className="mt-3 text-[#0a66c2] text-sm font-medium hover:underline flex items-center justify-center"
                    >
                      <FaEdit className="mr-1" /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Profile Information Form */}
                <div className="px-4 pb-4">
                  {errors.profilePicture && (
                    <p className="text-[#b24020] text-sm mt-1 text-center mb-3">
                      {errors.profilePicture}
                    </p>
                  )}

                  {changePassword ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#f3f6f8] p-4 rounded-lg mb-4"
                    >
                      <h3 className="text-md font-semibold text-[#38434f] mb-3 flex items-center">
                        <FaKey className="mr-2 text-[#0a66c2]" /> Change
                        Password
                      </h3>

                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.currentPassword && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.newPassword && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.confirmPassword && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={handleUpdatePassword}
                          className="flex items-center bg-[#0a66c2] text-white text-sm px-3 py-1.5 rounded hover:bg-[#004182] transition-colors"
                        >
                          <FaSave className="mr-1" /> Update
                        </button>
                        <button
                          type="button"
                          onClick={handlePasswordToggle}
                          className="flex items-center bg-[#f3f6f8] text-[#56687a] text-sm border border-[#dce6f1] px-3 py-1.5 rounded hover:bg-[#dce6f1] transition-colors"
                        >
                          <FaTimes className="mr-1" /> Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : editing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          <FaUser className="inline mr-1 text-[#0a66c2]" /> Full
                          Name
                        </label>
                        <input
                          type="text"
                          name="Name"
                          value={customer.Name || ""}
                          onChange={handleChange}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.name && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          <FaIdCard className="inline mr-1 text-[#0a66c2]" />{" "}
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={customer.username || ""}
                          onChange={handleChange}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.username && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.username}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          <FaPhone className="inline mr-1 text-[#0a66c2]" />{" "}
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phno"
                          value={customer.phno || ""}
                          onChange={handleChange}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.phoneNumber && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#56687a] text-xs font-medium mb-1">
                          <FaEnvelope className="inline mr-1 text-[#0a66c2]" />{" "}
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="gmail"
                          value={customer.gmail || ""}
                          onChange={handleChange}
                          className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                        />
                        {errors.email && (
                          <p className="text-[#b24020] text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={handleUpdateCustomer}
                          className="flex items-center bg-[#0a66c2] text-white text-sm px-3 py-1.5 rounded hover:bg-[#004182] transition-colors"
                        >
                          <FaSave className="mr-1" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="flex items-center bg-[#f3f6f8] text-[#56687a] text-sm border border-[#dce6f1] px-3 py-1.5 rounded hover:bg-[#dce6f1] transition-colors"
                        >
                          <FaTimes className="mr-1" /> Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="border-t border-[#e9e5df] pt-4 mt-2">
                      <div className="text-left space-y-3">
                        <div className="flex items-center">
                          <FaPhone className="text-[#56687a] mr-2 w-4" />
                          <div>
                            <p className="text-xs text-[#56687a]">Phone</p>
                            <p className="text-sm text-[#38434f]">
                              {customer?.phno || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="text-[#56687a] mr-2 w-4" />
                          <div>
                            <p className="text-xs text-[#56687a]">Email</p>
                            <p className="text-sm text-[#38434f]">
                              {customer?.gmail || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaIdCard className="text-[#56687a] mr-2 w-4" />
                          <div>
                            <p className="text-xs text-[#56687a]">Username</p>
                            <p className="text-sm text-[#38434f]">
                              {customer?.username || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#e9e5df] p-4">
                  {!editing && !changePassword && (
                    <button
                      onClick={handlePasswordToggle}
                      className="w-full flex items-center justify-center text-[#0a66c2] bg-[#f3f6f8] hover:bg-[#dce6f1] px-3 py-2 rounded transition-colors"
                    >
                      <FaKey className="mr-2" /> Change Password
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center text-[#56687a] hover:text-[#0a66c2] mt-3 px-3 py-2 rounded transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-[#38434f] mb-3">
                  Quick Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#56687a]">Total Bookings</span>
                    <span className="font-bold text-[#38434f]">
                      {bookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#56687a]">Confirmed</span>
                    <span className="font-bold text-[#44712e]">
                      {bookings.filter((b) => b.status === "confirmed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#56687a]">Pending</span>
                    <span className="font-bold text-[#e7a33e]">
                      {bookings.filter((b) => b.status === "pending").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#38434f] flex items-center">
                    <FaSuitcase className="mr-2 text-[#0a66c2]" /> Your Travel
                    Bookings
                  </h2>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        statusFilter === "all"
                          ? "bg-[#0a66c2] text-white"
                          : "bg-[#f3f6f8] text-[#56687a] hover:bg-[#dce6f1]"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setStatusFilter("confirmed")}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        statusFilter === "confirmed"
                          ? "bg-[#0a66c2] text-white"
                          : "bg-[#f3f6f8] text-[#56687a] hover:bg-[#dce6f1]"
                      }`}
                    >
                      Confirmed
                    </button>
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        statusFilter === "pending"
                          ? "bg-[#0a66c2] text-white"
                          : "bg-[#f3f6f8] text-[#56687a] hover:bg-[#dce6f1]"
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings
                      .filter(
                        (booking) =>
                          statusFilter === "all" ||
                          booking.status === statusFilter
                      )
                      .map((booking) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#f3f6f8] rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-lg font-semibold text-[#38434f] mb-2 flex items-center">
                                <FaSuitcase className="text-[#0a66c2] mr-2" />
                                {booking.packageName || "N/A"}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[#56687a]">
                                <div className="flex items-center">
                                  <FaUserTie className="mr-2" />
                                  <span>
                                    Guide: {booking.guideName || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FaCalendarAlt className="mr-2" />
                                  <span>
                                    Date:{" "}
                                    {new Date(
                                      booking.bookingDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FaIdCard className="mr-2" />
                                  <span>
                                    Booking ID:{" "}
                                    {booking.bookingId || booking._id}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium text-[#44712e]">
                                    ₹{booking.totalPrice}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-[#f3f6f8] rounded-lg p-8 text-center">
                    <FaSuitcase className="text-[#56687a] text-5xl mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#38434f] mb-2">
                      No Bookings Found
                    </h3>
                    <p className="text-[#56687a]">
                      You have not made any travel bookings yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
