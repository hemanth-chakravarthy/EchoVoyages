/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaSort,
  FaDollarSign,
} from "react-icons/fa";
import { MdExplore } from "react-icons/md";

const HomePage = () => {
  // Remove other filter states and options, keep only sortBy
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("dateModified");

  const [filters, setFilters] = useState({
    location: "All",
    price: "All",
    duration: "All",
  });

  // Add filter options
  const filterOptions = {
    location: ["All", "Asia", "Europe", "Americas", "Africa", "Oceania"],
    price: ["All", "Budget", "Standard", "Luxury"],
    duration: [
      "All",
      "Short (1-3 days)",
      "Medium (4-7 days)",
      "Long (8+ days)",
    ],
  };

  // Filter function
  const filterPackages = (packages) => {
    return packages.filter((pack) => {
      const locationMatch =
        filters.location === "All" || pack.location === filters.location;
      const priceMatch =
        filters.price === "All" || pack.priceCategory === filters.price;
      const durationMatch =
        filters.duration === "All" ||
        (filters.duration === "Short (1-3 days)" && pack.duration <= 3) ||
        (filters.duration === "Medium (4-7 days)" &&
          pack.duration > 3 &&
          pack.duration <= 7) ||
        (filters.duration === "Long (8+ days)" && pack.duration > 7);

      return locationMatch && priceMatch && durationMatch;
    });
  };

  // Sorting function
  const sortPackages = (packages, sortType) => {
    const sortedPackages = [...packages];
    switch (sortType) {
      case "dateModified":
        return sortedPackages.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      case "priceLowToHigh":
        return sortedPackages.sort((a, b) => a.price - b.price);
      case "priceHighToLow":
        return sortedPackages.sort((a, b) => b.price - a.price);
      case "duration":
        return sortedPackages.sort((a, b) => a.duration - b.duration);
      default:
        return sortedPackages;
    }
  };

  // Fetch packages and sort them
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/packages");
        const data = await response.json();

        if (data && data.data) {
          const sortedPackages = sortPackages(data.data, sortBy);
          setPackages(sortedPackages);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-[#f3f6f8] font-['Inter',sans-serif]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section remains the same */}

        {/* Modified Sort Section */}
        <div className="rounded-xl shadow-sm p-6 mb-8">
          <div className="max-w-xs mx-auto">
            <label className="block text-lg font-medium text-gray-700 mb-1 text-center">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
            >
              <option value="dateModified">Latest Updates</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a66c2]"></div>
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(
              (pack, index) =>
                pack.isActive && (
                  <motion.div
                    key={pack._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                      {pack.image && pack.image.length > 0 ? (
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          src={`http://localhost:5000${pack.image[0]}`}
                          alt={pack.name}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-r from-[#0a66c2] to-[#0a66c2]/70 flex items-center justify-center">
                          <MdExplore className="text-white text-5xl" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                          {pack.name}
                        </h3>

                        <div className="flex items-center mb-2">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="font-medium text-gray-700">
                            {pack.reviews && pack.reviews.length > 0
                              ? (
                                  pack.reviews.reduce(
                                    (sum, review) => sum + review.rating,
                                    0
                                  ) / pack.reviews.length
                                ).toFixed(1)
                              : "0.0"}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">
                            ({pack.reviews ? pack.reviews.length : 0} reviews)
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {pack.description}
                        </p>
                      </div>

                      {/* Location and Duration info */}
                      <div className="flex flex-col gap-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="min-w-[16px] mr-2" />
                          <span className="line-clamp-1">{pack.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="min-w-[16px] mr-2" />
                          <span>{pack.duration} days</span>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-[#0a66c2] font-semibold text-xl">
                          ₹{pack.price.toLocaleString()}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/packages/${pack._id}`}
                            className="bg-[#0a66c2] text-white px-4 py-2 rounded-md hover:bg-[#084e96] transition-colors duration-300"
                          >
                            View Details
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <MdExplore className="text-[#0a66c2] text-6xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No packages available at the moment
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
