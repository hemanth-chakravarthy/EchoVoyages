/** @format */

/** @format */
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaEye,
  FaChartLine,
  FaListAlt,
  FaThLarge,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const AgentViewAll = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("revenue");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingCount = async (packageId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/bookings/pack/${packageId}`
        );
        if (response.status === 404) {
          console.log(`No bookings found for package ${packageId}`);
          return 0;
        }
        if (!response.ok) {
          throw new Error(
            `Failed to fetch booking count for package ${packageId}`
          );
        }
        const bookingCount = await response.json();
        return bookingCount.length;
      } catch (error) {
        console.error("Error fetching booking count:", error);
        return 0;
      }
    };

    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const agentId = decodedToken.id;
        const response = await fetch(
          `http://localhost:5000/packages/agents/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch packages");
        }

        const data = await response.json();
        const packagesWithRevenue = await Promise.all(
          data.map(async (pkg) => {
            const numbookings = await fetchBookingCount(pkg._id);
            return {
              ...pkg,
              revenue: pkg.price * numbookings,
              bookingCount: numbookings,
            };
          })
        );

        const sortedPackages = packagesWithRevenue.sort(
          (a, b) => b.revenue - a.revenue
        );
        setPackages(sortedPackages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    let sortedPackages = [...packages];

    switch (e.target.value) {
      case "revenue":
        sortedPackages.sort((a, b) => b.revenue - a.revenue);
        break;
      case "price":
        sortedPackages.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        sortedPackages.sort((a, b) => b.duration - a.duration);
        break;
      case "bookings":
        sortedPackages.sort((a, b) => b.bookingCount - a.bookingCount);
        break;
      default:
        break;
    }

    setPackages(sortedPackages);
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.itinerary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPackageImage = (pkg) => {
    if (!pkg.image)
      return "https://via.placeholder.com/400x200?text=Travel+Package";

    // Handle array of image paths
    if (Array.isArray(pkg.image)) {
      if (pkg.image.length === 0)
        return "https://via.placeholder.com/400x200?text=Travel+Package";

      // Get the first image path and ensure it starts with http://localhost:5000
      const imagePath = pkg.image[0];
      if (imagePath.startsWith('/')) {
        return `http://localhost:5000${imagePath}`;
      }
      return imagePath;
    }

    // Handle single image path as string
    if (typeof pkg.image === 'string') {
      if (pkg.image.startsWith('/')) {
        return `http://localhost:5000${pkg.image}`;
      }
      return pkg.image;
    }

    return "https://via.placeholder.com/400x200?text=Travel+Package";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] flex items-center justify-center font-['Source Sans', 'Segoe UI', Arial, sans-serif]">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#38434f] font-medium">Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] flex items-center justify-center font-['Source Sans', 'Segoe UI', Arial, sans-serif]">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md">
          <h2 className="text-[#b24020] text-xl font-bold mb-4">Error</h2>
          <p className="text-[#38434f]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#38434f]">
                Travel Packages
              </h1>
              <p className="text-[#56687a]">
                Manage and monitor your travel packages
              </p>
            </div>
            <Link
              to="/createPackage"
              className="mt-4 md:mt-0 bg-[#0a66c2] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#004182] transition-colors"
            >
              <FaBriefcase className="mr-2" /> Create New Package
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#56687a] z-10" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={handleSearch}
                className="input w-full pl-10 bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <FaFilter className="mr-2 text-[#56687a]" />
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                >
                  <option value="revenue">Sort by Revenue</option>
                  <option value="price">Sort by Price</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="bookings">Sort by Bookings</option>
                </select>
              </div>
              <div className="flex border border-[#dce6f1] rounded overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-[#dce6f1] text-[#0a66c2]" : "bg-white text-[#56687a]"}`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-[#dce6f1] text-[#0a66c2]" : "bg-white text-[#56687a]"}`}
                >
                  <FaListAlt />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Display */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-bold text-[#38434f] mb-2">
              No packages found
            </h2>
            <p className="text-[#56687a] mb-4">
              Try adjusting your search criteria or create a new package.
            </p>
            <Link
              to="/createPackage"
              className="inline-block bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors"
            >
              <FaBriefcase className="inline mr-2" /> Create New Package
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={getPackageImage(pkg)}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-0 right-0 bg-[#0a66c2] text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                    Rs. {pkg.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#38434f] mb-2 truncate">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center text-[#56687a] mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="truncate">{pkg.location}</span>
                  </div>
                  <div className="flex items-center text-[#56687a] mb-3">
                    <FaCalendarAlt className="mr-1" />
                    <span>{pkg.duration} days</span>
                  </div>
                  <div className="border-t border-[#e9e5df] pt-3 mt-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-[#56687a]">
                        <FaChartLine className="mr-1 text-[#44712e]" />
                        <span>
                          Revenue:{" "}
                          <span className="font-medium text-[#44712e]">
                            Rs. {pkg.revenue.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="text-[#56687a] text-sm">
                        {pkg.bookingCount || 0} bookings
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewPackage(pkg._id)}
                      className="w-full bg-[#f3f6f8] hover:bg-[#dce6f1] text-[#0a66c2] font-medium py-2 rounded flex items-center justify-center transition-colors"
                    >
                      <FaEye className="mr-2" /> View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                    <img
                      src={getPackageImage(pkg)}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[#38434f]">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center text-[#0a66c2] font-medium mt-2 md:mt-0">
                        Rs. {pkg.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
                      <div className="flex items-center text-[#56687a]">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{pkg.location}</span>
                      </div>
                      <div className="flex items-center text-[#56687a]">
                        <FaCalendarAlt className="mr-1" />
                        <span>{pkg.duration} days</span>
                      </div>
                      <div className="flex items-center text-[#56687a]">
                        <FaChartLine className="mr-1 text-[#44712e]" />
                        <span>
                          Revenue:{" "}
                          <span className="font-medium text-[#44712e]">
                            Rs. {pkg.revenue.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="text-[#56687a]">
                        {pkg.bookingCount || 0} bookings
                      </div>
                    </div>
                    <p className="text-[#38434f] mb-4 line-clamp-2">
                      {pkg.itinerary}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleViewPackage(pkg._id)}
                        className="bg-[#f3f6f8] hover:bg-[#dce6f1] text-[#0a66c2] font-medium px-4 py-2 rounded flex items-center transition-colors"
                      >
                        <FaEye className="mr-2" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentViewAll;
