import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "All",
    price: "All",
    duration: "All"
  });

  // Add filter options
  const filterOptions = {
    location: ["All", "Asia", "Europe", "Americas", "Africa", "Oceania"],
    price: ["All", "Budget", "Standard", "Luxury"],
    duration: ["All", "Short (1-3 days)", "Medium (4-7 days)", "Long (8+ days)"]
  };

  // Filter function
  const filterPackages = (packages) => {
    return packages.filter(pack => {
      const locationMatch = filters.location === "All" || pack.location === filters.location;
      const priceMatch = filters.price === "All" || pack.priceCategory === filters.price;
      const durationMatch = filters.duration === "All" ||
        (filters.duration === "Short (1-3 days)" && pack.duration <= 3) ||
        (filters.duration === "Medium (4-7 days)" && pack.duration > 3 && pack.duration <= 7) ||
        (filters.duration === "Long (8+ days)" && pack.duration > 7);

      return locationMatch && priceMatch && durationMatch;
    });
  };
  const [sortBy, setSortBy] = useState("dateModified");

  // Sorting function
  const sortPackages = (packages, sortType) => {
    const sortedPackages = [...packages];
    switch (sortType) {
      case "dateModified":
        return sortedPackages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
      }}
    >

      <motion.main
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-bold text-center mb-16 text-[#1a365d] tracking-tight"
        >
          Discover Your Next Adventure
        </motion.h1>

        {/* Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-center"
        >
          <div className="bg-gradient-to-r from-[#1a365d]/5 to-[#4169E1]/5 backdrop-blur-sm
            px-8 py-4 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#1a365d] text-lg tracking-wide">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none min-w-[200px] bg-white text-[#2d3748]
                  px-5 py-2.5 rounded-lg border border-gray-200
                  hover:border-[#4169E1]/30 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent
                  font-medium text-base tracking-wide cursor-pointer shadow-sm"
              >
                <option className="text-base font-medium py-2" value="dateModified">Latest Updates</option>
                <option className="text-base font-medium py-2" value="priceLowToHigh"><span className="font-bold">Price</span>: Low to High</option>
                <option className="text-base font-medium py-2" value="priceHighToLow"><span className="font-bold">Price</span>: High to Low</option>
                <option className="text-base font-medium py-2" value="duration">Duration</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin mx-auto"></div>
            <p className="text-center text-xl text-[#1a365d] mt-4">Loading packages...</p>
          </motion.div>
        ) : packages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pack, index) =>
              pack.isActive && (
                <motion.div
                  key={pack._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)",
                    transition: { duration: 0.3 },
                  }}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative group">
                    {pack.image && pack.image.length > 0 ? (
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={`http://localhost:5000${pack.image[0]}`} // Render only the first image
                        alt={`Image of ${pack.name}`}
                        className="w-full h-[300px] object-cover transform group-hover:brightness-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="h-[300px] bg-gradient-to-r from-[#1a365d] to-[#4169E1] flex items-center justify-center">
                        <p className="text-white font-medium">No image available</p>
                      </div>
                    )}
                  </div>
                  <motion.div
                    className="p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-[#1a365d] mb-3 tracking-tight">{pack.name}</h2>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-700 font-bold mr-1">
                          {pack.reviews && pack.reviews.length > 0
                            ? (pack.reviews.reduce((sum, review) => sum + review.rating, 0) / pack.reviews.length).toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-yellow-700">★</span>
                        <span className="text-gray-600 ml-2 text-sm">
                          ({pack.reviews ? pack.reviews.length : 0} {pack.reviews && pack.reviews.length === 1 ? "rating" : "ratings"})
                        </span>
                      </div>
                    </div>

                    <p className="text-[#2d3748] mb-6 leading-relaxed line-clamp-3">{pack.description}</p>
                    <div className="flex justify-between items-center mb-6">
                      <motion.p
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-[#1a365d] bg-blue-50 px-6 py-2 rounded-md"
                      >
                        ₹{pack.price}
                      </motion.p>
                      <p className="text-md text-[#2d3748] bg-gray-50 px-4 py-2 rounded-md border border-gray-100">
                        {pack.duration} days
                      </p>
                    </div>
                    <Link to={`/packages/${pack._id}`} className="block">
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "#1a365d",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#00072D] text-white font-semibold py-4 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Explore Package
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              )
            )}
          </motion.div>
        ) : (
          <p className="text-center text-xl text-[#81BFDA]">No packages available</p>
        )}
      </motion.main>
    </motion.div>
  );
};

export default HomePage;