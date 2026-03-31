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
  FaCheckCircle,
  FaHourglassHalf,
  FaBan,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
      if (customer.Name) formData.append("Name", customer.Name);
      if (customer.username) formData.append("username", customer.username);
      if (customer.phno) formData.append("phno", customer.phno);
      if (customer.gmail) formData.append("gmail", customer.gmail);
      if (customer.specialization)
        formData.append("specialization", customer.specialization);
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

  const filteredBookings = bookings.filter(
    (booking) => statusFilter === "all" || booking.status === statusFilter
  );

  if (loading) {
    return (
      <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
          </div>
          <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            009 / Customer Profile
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            {customer?.Name || "CUSTOMER"}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Manage your profile, view bookings, and update your account settings.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            {/* Profile Card */}
            <div className="border border-[#111111]/10 bg-[#ffffff] mb-6">
              <div className="p-6 md:p-8 flex flex-col items-center border-b border-[#111111]/10">
                <div className="relative group">
                  <div className="w-32 h-32 border border-[#111111]/20 overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt={customer.Name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-[#111111]/20 text-4xl" />
                      </div>
                    )}
                  </div>
                  {editing && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaCamera className="text-white text-xl" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>

                <p className="text-[10px] text-[#111111]/50 uppercase tracking-widest mt-4">
                  {customer?.gmail || "No email available"}
                </p>
              </div>

              {/* Profile Info / Edit Form */}
              <div className="p-6 md:p-8">
                {changePassword ? (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 mb-4 flex items-center gap-2">
                      <FaKey className="text-xs" /> Change Password
                    </h3>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.currentPassword && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleUpdatePassword}
                        className="flex-1 bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                      >
                        Update
                      </button>
                      <button
                        onClick={handlePasswordToggle}
                        className="flex-1 border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={customer.Name || ""}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={customer.username || ""}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phno"
                        value={customer.phno || ""}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="gmail"
                        value={customer.gmail || ""}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleUpdateCustomer}
                        className="flex-1 bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="flex-1 border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-[#111111]/30 text-xs" />
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                          Phone
                        </p>
                        <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                          {customer?.phno || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#111111]/30 text-xs" />
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                          Email
                        </p>
                        <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                          {customer?.gmail || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaIdCard className="text-[#111111]/30 text-xs" />
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                          Username
                        </p>
                        <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                          {customer?.username || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <button
                        onClick={handleEditToggle}
                        className="w-full bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaEdit className="text-xs" /> Edit Profile
                      </button>
                      <button
                        onClick={handlePasswordToggle}
                        className="w-full border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaKey className="text-xs" /> Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <div className="p-6 md:p-8 border-t border-[#111111]/10">
                <button
                  onClick={handleLogout}
                  className="w-full border border-red-500/30 text-red-600 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border border-[#111111]/10 bg-[#ffffff] p-6 md:p-8">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 mb-6">
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                    Total Bookings
                  </span>
                  <span className="text-lg font-bold text-[#111111]">
                    {bookings.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                    Confirmed
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                    Pending
                  </span>
                  <span className="text-lg font-bold text-yellow-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Bookings */}
          <div className="flex-1">
            <div className="border border-[#111111]/10 bg-[#ffffff]">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border-b border-[#111111]/10">
                <h2 className="text-base md:text-lg font-bold tracking-tight text-[#111111] flex items-center gap-3">
                  <FaSuitcase className="text-[#111111]/40 text-lg" />
                  Travel Bookings
                </h2>
                <div className="flex gap-2 mt-4 md:mt-0">
                  {["all", "confirmed", "pending"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        statusFilter === status
                          ? "bg-[#111111] text-[#f5f3f0]"
                          : "border border-[#111111]/30 text-[#111111]/50 hover:text-[#111111] hover:bg-[#f0eeeb]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {filteredBookings.length > 0 ? (
                <div className="divide-y divide-[#111111]/5">
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 md:p-8 hover:bg-[#f0eeeb] transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111] mb-3">
                            {booking.packageName || "N/A"}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center gap-3">
                              <FaUserTie className="text-[#111111]/30 text-xs" />
                              <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                                Guide: {booking.guideName || "N/A"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="text-[#111111]/30 text-xs" />
                              <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <FaIdCard className="text-[#111111]/30 text-xs" />
                              <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                                {booking.bookingId || booking._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                ₹{booking.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 w-fit shrink-0 ${
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-600 border border-green-500/30"
                              : booking.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30"
                              : "bg-red-500/10 text-red-600 border border-red-500/30"
                          }`}
                        >
                          {booking.status === "confirmed" && <FaCheckCircle className="text-xs" />}
                          {booking.status === "pending" && <FaHourglassHalf className="text-xs" />}
                          {booking.status === "cancelled" && <FaBan className="text-xs" />}
                          {booking.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 md:p-16 text-center">
                  <FaSuitcase className="w-16 h-16 text-[#111111]/20 mx-auto mb-6" />
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
                    No Bookings Found
                  </h3>
                  <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
                    {statusFilter !== "all"
                      ? `No ${statusFilter} bookings found.`
                      : "You have not made any travel bookings yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
