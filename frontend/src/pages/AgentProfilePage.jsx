/** @format */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import {
  FaEdit,
  FaSignOutAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaChartBar,
  FaSave,
  FaTimes,
  FaCalendar,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

const AgentProfilePage = () => {
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [agent, setAgent] = useState({
    contactInfo: {},
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeIndex, setActiveIndex] = useState(0);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const id = token ? jwtDecode(token).id : null;
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

  // LinkedIn color palette
  const colors = {
    primary: "#0a66c2", // LinkedIn Science Blue
    secondary: "#004182", // LinkedIn Congress Blue
    text: {
      primary: "#38434f", // LinkedIn Limed Spruce
      secondary: "#56687a", // LinkedIn Blue Bayoux
    },
    background: {
      main: "#f3f2ef", // LinkedIn Pampas
      card: "#ffffff", // White
      hover: "#dce6f1", // LinkedIn Botticelli
    },
    chart: {
      colors: [
        "#0a66c2",
        "#83941f",
        "#e7a33e",
        "#f5987e",
        "#56687a",
        "#0073b1",
        "#598b8e",
        "#c06c84",
        "#6c5b7b",
        "#355c7d",
      ],
    },
    success: "#44712e", // LinkedIn Chalet Green
    error: "#b24020", // LinkedIn Roof Terracotta
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/agency/${id}`);
        setAgent(response.data);
        if (response.data.profileImage) {
          const profileImageUrl = response.data.profileImage.startsWith("http")
            ? response.data.profileImage
            : `${apiUrl}/${response.data.profileImage}`;
          setPreviewImage(profileImageUrl);
        }
      } catch (error) {
        toast.error("Error fetching agent details");
        console.log(error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/packages/agents/${id}`);
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
      const response = await axios.get(`${apiUrl}/bookings/pack/${packageId}`);
      return response.data.length;
    } catch (error) {
      console.error("Error fetching booking count:", error);
      return 0;
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setErrors({});
    if (editing && !agent.profileImage) {
      setPreviewImage(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgent((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleImageClick = () => {
    if (editing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!agent.name) newErrors.name = "Name is required";
    if (!agent.username) newErrors.username = "Username is required";
    if (!agent.specialization)
      newErrors.specialization = "Specialization is required";
    if (!agent.contactInfo?.phone) newErrors.phone = "Phone number is required";
    if (!agent.contactInfo?.email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateAgent = async () => {
    if (validateForm()) {
      try {
        const loadingToastId = toast.loading("Updating profile...");
        const formData = new FormData();

        Object.keys(agent).forEach((key) => {
          if (
            key !== "contactInfo" &&
            key !== "profileImage" &&
            key !== "travelPackages"
          ) {
            if (Array.isArray(agent[key])) {
              if (agent[key].length > 0) {
                formData.append(key, JSON.stringify(agent[key]));
              }
            } else {
              formData.append(key, agent[key]);
            }
          }
        });

        if (agent.travelPackages && agent.travelPackages.length > 0) {
          const validPackages = agent.travelPackages.filter(
            (pkg) => pkg && pkg.trim() !== ""
          );
          if (validPackages.length > 0) {
            formData.append("travelPackages", JSON.stringify(validPackages));
          }
        }

        formData.append("contactInfo.phone", agent.contactInfo.phone || "");
        formData.append("contactInfo.email", agent.contactInfo.email || "");

        if (profileImage) {
          formData.append("profileImage", profileImage);
        }

        const response = await axios.put(`${apiUrl}/agency/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.update(loadingToastId, {
          render: "Profile updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        setAgent(response.data);

        if (response.data.profileImage) {
          const profileImageUrl = response.data.profileImage.startsWith("http")
            ? response.data.profileImage
            : `${apiUrl}/${response.data.profileImage}`;
          setPreviewImage(profileImageUrl);
        }

        setEditing(false);
        setProfileImage(null);
      } catch (error) {
        toast.error("Error occurred while updating agent details");
        console.error("Update error:", error);
      }
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    setAgent((prev) => ({ ...prev, profileImage: null }));
  };

  // Generate data for pie chart
  const pieData = chartData.map((item, index) => ({
    name: item.name,
    value: item.count,
    fill: colors.chart.colors[index % colors.chart.colors.length],
  }));

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#dce6f1] rounded-md shadow-lg">
          <p className="font-medium text-[#38434f]">
            {label || payload[0].name}
          </p>
          <p className="text-[#0a66c2]">
            <span className="font-bold">{payload[0].value}</span> bookings
          </p>
        </div>
      );
    }
    return null;
  };

  // Active shape for pie chart
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="text-sm font-medium"
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="text-xs"
        >
          {`${value} Bookings`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          className="text-xs"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#f3f6f8]  font-['Source Sans', 'Segoe UI', Arial, sans-serif]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="relative">
            <div className="relative">
              <div className="h-64 overflow-hidden">
                <img
                  src="/images/travel-banner.png"
                  alt="Travel Agency Banner"
                  className="w-full h-full object-cover"
                />
                {/* Optional overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              <div className="absolute -bottom-16 left-8">
                {/* Rest of your profile image code */}
              </div>
              {/* Rest of your header content */}
            </div>
            <div className="absolute -bottom-16 left-8">
              <div
                className="w-32 h-32 rounded-full border-4 border-white bg-[#e9e5df] flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-[#56687a] text-5xl" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="flex justify-end p-4">
              {!editing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center text-[#0a66c2] font-medium mr-3 hover:bg-[#dce6f1] px-3 py-1 rounded transition-colors"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-[#0a66c2] font-medium hover:bg-[#dce6f1] px-3 py-1 rounded transition-colors"
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdateAgent}
                    className="flex items-center bg-[#0a66c2] text-white font-medium mr-3 px-3 py-1 rounded hover:bg-[#004182] transition-colors"
                  >
                    <FaSave className="mr-1" /> Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center text-[#56687a] font-medium px-3 py-1 rounded hover:bg-[#e9e5df] transition-colors"
                  >
                    <FaTimes className="mr-1" /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-6">
            <div className="mb-6">
              {editing ? (
                <div className="mb-4">
                  <label className="block text-[#56687a] text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={agent.name || ""}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.name ? "border-[#b24020]" : "border-[#dce6f1]"
                    } rounded focus:outline-none focus:border-[#0a66c2] transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-[#b24020] text-xs mt-1">{errors.name}</p>
                  )}
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-[#38434f]">
                  {agent.name || "Agent Name"}
                </h1>
              )}

              {editing ? (
                <div className="mb-4">
                  <label className="block text-[#56687a] text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={agent.username || ""}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.username ? "border-[#b24020]" : "border-[#dce6f1]"
                    } rounded focus:outline-none focus:border-[#0a66c2] transition-colors`}
                  />
                  {errors.username && (
                    <p className="text-[#b24020] text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[#56687a] text-lg">
                  @{agent.username || "username"}
                </p>
              )}
            </div>

            <div className="mb-6">
              {editing ? (
                <div className="mb-4">
                  <label className="block text-[#56687a] text-sm font-medium mb-1">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={agent.specialization || ""}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.specialization
                        ? "border-[#b24020]"
                        : "border-[#dce6f1]"
                    } rounded focus:outline-none focus:border-[#0a66c2] transition-colors`}
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec.charAt(0).toUpperCase() + spec.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && (
                    <p className="text-[#b24020] text-xs mt-1">
                      {errors.specialization}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-[#56687a]">
                  <FaBriefcase className="mr-2" />
                  <span>
                    Specialization:{" "}
                    {agent.specialization
                      ? agent.specialization.charAt(0).toUpperCase() +
                        agent.specialization.slice(1)
                      : "Not specified"}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              {editing ? (
                <div className="mb-4">
                  <label className="block text-[#56687a] text-sm font-medium mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={agent.bio || ""}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full p-2 border ${
                      errors.bio ? "border-[#b24020]" : "border-[#dce6f1]"
                    } rounded focus:outline-none focus:border-[#0a66c2] transition-colors`}
                  ></textarea>
                  {errors.bio && (
                    <p className="text-[#b24020] text-xs mt-1">{errors.bio}</p>
                  )}
                </div>
              ) : (
                <p className="text-[#38434f] mb-4">
                  {agent.bio || "No bio available"}
                </p>
              )}
            </div>

            <div className="border-t border-[#e9e5df] pt-4">
              <h2 className="text-lg font-semibold text-[#38434f] mb-3">
                Contact Information
              </h2>

              {editing ? (
                <>
                  <div className="mb-4">
                    <label className="block text-[#56687a] text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={agent.contactInfo?.phone || ""}
                      onChange={(e) =>
                        setAgent((prev) => ({
                          ...prev,
                          contactInfo: {
                            ...prev.contactInfo,
                            phone: e.target.value,
                          },
                        }))
                      }
                      className={`w-full p-2 border ${
                        errors.phone ? "border-[#b24020]" : "border-[#dce6f1]"
                      } rounded focus:outline-none focus:border-[#0a66c2] transition-colors`}
                    />
                    {errors.phone && (
                      <p className="text-[#b24020] text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-[#56687a] text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={agent.contactInfo?.email || ""}
                      onChange={(e) =>
                        setAgent((prev) => ({
                          ...prev,
                          contactInfo: {
                            ...prev.contactInfo,
                            email: e.target.value,
                          },
                        }))
                      }
                      className={`w-full p-2 border ${
                        errors.email ? "border-[#b24020]" : "border-[#dce6f1]"
                      } rounded focus:outline-none focus:border-[#0a66c2] transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-[#b24020] text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center text-[#56687a]">
                    <FaPhone className="mr-2" />
                    <span>{agent.contactInfo?.phone || "No phone number"}</span>
                  </div>
                  <div className="flex items-center text-[#56687a]">
                    <FaEnvelope className="mr-2" />
                    <span>
                      {agent.contactInfo?.email || "No email address"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="flex border-b border-[#e9e5df]">
            <button
              className={`flex items-center px-6 py-3 font-medium ${
                activeTab === "overview"
                  ? "text-[#0a66c2] border-b-2 border-[#0a66c2]"
                  : "text-[#56687a] hover:bg-[#f3f2ef]"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <FaChartBar className="mr-2" /> Overview
            </button>
            <button
              className={`flex items-center px-6 py-3 font-medium ${
                activeTab === "performance"
                  ? "text-[#0a66c2] border-b-2 border-[#0a66c2]"
                  : "text-[#56687a] hover:bg-[#f3f2ef]"
              }`}
              onClick={() => setActiveTab("performance")}
            >
              <FaChartLine className="mr-2" /> Performance
            </button>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {activeTab === "overview" ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#f3f2ef] p-4 rounded-lg">
                    <div className="flex items-center text-[#56687a] mb-2">
                      <FaBriefcase className="mr-2" />
                      <span className="text-sm font-medium">
                        Total Packages
                      </span>
                    </div>
                    <p className="text-[#38434f] text-2xl font-bold">
                      {chartData.length}
                    </p>
                  </div>

                  <div className="bg-[#f3f2ef] p-4 rounded-lg">
                    <div className="flex items-center text-[#56687a] mb-2">
                      <FaCalendar className="mr-2" />
                      <span className="text-sm font-medium">
                        Total Bookings
                      </span>
                    </div>
                    <p className="text-[#38434f] text-2xl font-bold">
                      {chartData.reduce((sum, item) => sum + item.count, 0)}
                    </p>
                  </div>

                  <div className="bg-[#f3f2ef] p-4 rounded-lg">
                    <div className="flex items-center text-[#56687a] mb-2">
                      <FaDollarSign className="mr-2" />
                      <span className="text-sm font-medium">Total Revenue</span>
                    </div>
                    <p className="text-[#0a66c2] text-2xl font-bold">
                      Rs. {totalAmountEarned}
                    </p>
                  </div>
                </div>

                {/* Larger Pie Chart */}
                <div className="bg-[#f3f2ef] p-4 rounded-lg">
                  <h3 className="text-[#38434f] font-semibold mb-4">
                    Booking Distribution
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center text-[#56687a] text-sm">
                    Hover over segments to see details
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-[#38434f] font-semibold mb-4">
                    Performance Trends
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e9e5df" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#56687a" }}
                          axisLine={{ stroke: "#e9e5df" }}
                        />
                        <YAxis
                          tick={{ fill: "#56687a" }}
                          axisLine={{ stroke: "#e9e5df" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Bookings"
                          stroke="#0a66c2"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#0a66c2" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#f3f2ef] p-4 rounded-lg">
                  <h3 className="text-[#38434f] font-semibold mb-4">
                    Package Details
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-[#dce6f1]">
                          <th className="py-3 px-4 text-left text-[#56687a] font-medium">
                            Package Name
                          </th>
                          <th className="py-3 px-4 text-left text-[#56687a] font-medium">
                            Bookings
                          </th>
                          <th className="py-3 px-4 text-left text-[#56687a] font-medium">
                            Price
                          </th>
                          <th className="py-3 px-4 text-left text-[#56687a] font-medium">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.map((item, index) => {
                          const packageData = bookings[index] || {};
                          return (
                            <tr
                              key={index}
                              className="border-b border-[#e9e5df] hover:bg-[#f3f2ef]"
                            >
                              <td className="py-3 px-4 text-[#38434f]">
                                {item.name}
                              </td>
                              <td className="py-3 px-4 text-[#38434f]">
                                {item.count}
                              </td>
                              <td className="py-3 px-4 text-[#38434f]">
                                Rs. {packageData.price || 0}
                              </td>
                              <td className="py-3 px-4 text-[#38434f]">
                                Rs. {(packageData.price || 0) * item.count}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AgentProfilePage;
