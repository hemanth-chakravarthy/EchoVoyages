import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AgentViewAll = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingCount = async (packageId) => {
      try {
        const response = await fetch(`http://localhost:5000/bookings/pack/${packageId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch booking count for package ${packageId}`);
        }
        const bookingCount = await response.json();
        return bookingCount.length; // Assuming the response is an array of bookings
      } catch (error) {
        console.error('Error fetching booking count:', error);
        return 0; // Default to 0 if there's an error
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

        // Calculate revenue for each package
        const packagesWithRevenue = await Promise.all(data.map(async pkg => {
          // Fetch booking count for each package individually
          const numbookings = await fetchBookingCount(pkg._id);
          return {
            ...pkg,
            revenue: pkg.price * numbookings
          };
        }));

        // Sort packages by revenue
        const sortedPackages = packagesWithRevenue.sort((a, b) => b.revenue - a.revenue);

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


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#4169E1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Display top 3 hero packages
  const topHeroPackages = packages.slice(0, 3);

  // Display remaining packages
  const remainingPackages = packages.slice(3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      {/* <nav className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/AgentHome" className="text-2xl font-bold text-[#1a365d]">
              EchoVoyages
            </Link>
            <div className="flex items-center space-x-4">
              {[
                { to: "/AgentHome", text: "Home" },
                { to: "/mylistings", text: "My Listings" },
                { to: "/createPackage", text: "Create Package" },
                { to: "/AgentProfilePage", text: "Profile" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-full text-[#2d3748] hover:bg-[#4169E1]/10 hover:text-[#4169E1] transition-all duration-300"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav> */}

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <h1 className="text-5xl font-bold text-[#1a365d] tracking-tight text-center mb-12">
          My Travel Packages
        </h1>

        {packages.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-[#2d3748] text-center"
          >
            No packages found. Start by creating your first package!
          </motion.p>
        ) : (
          <div>
            <h2 className="text-4xl font-bold text-[#1a365d] tracking-tight text-center mb-8">
              Top Hero Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topHeroPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                  }}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#1a365d] mb-4">{pkg.name}</h2>
                    <p className="text-[#2d3748] leading-relaxed mb-2">Location: {pkg.location}</p>
                    <p className="text-2xl font-bold text-[#4169E1] mb-4">Rs. {pkg.price}</p>
                    <p className="text-[#2d3748] leading-relaxed mb-2">Duration: {pkg.duration} days</p>
                    <p className="text-[#2d3748] leading-relaxed mb-4">{pkg.itinerary}</p>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-700 font-bold mr-1">
                          {pkg.reviews && pkg.reviews.length > 0
                            ? (pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length).toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-yellow-700">★</span>
                        <span className="text-gray-600 ml-2 text-sm">
                          ({pkg.reviews ? pkg.reviews.length : 0} {pkg.reviews && pkg.reviews.length === 1 ? "rating" : "ratings"})
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewPackage(pkg._id)}
                      className="w-full px-6 py-3 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <h2 className="text-4xl font-bold text-[#1a365d] tracking-tight text-center mt-12 mb-8">
              All Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                  }}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#1a365d] mb-4">{pkg.name}</h2>
                    <p className="text-[#2d3748] leading-relaxed mb-2">Location: {pkg.location}</p>
                    <p className="text-2xl font-bold text-[#4169E1] mb-4">Rs. {pkg.price}</p>
                    <p className="text-[#2d3748] leading-relaxed mb-2">Duration: {pkg.duration} days</p>
                    <p className="text-[#2d3748] leading-relaxed mb-4">{pkg.itinerary}</p>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-700 font-bold mr-1">
                          {pkg.reviews && pkg.reviews.length > 0
                            ? (pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length).toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-yellow-700">★</span>
                        <span className="text-gray-600 ml-2 text-sm">
                          ({pkg.reviews ? pkg.reviews.length : 0} {pkg.reviews && pkg.reviews.length === 1 ? "rating" : "ratings"})
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewPackage(pkg._id)}
                      className="w-full px-6 py-3 bg-[#00072D] text-white rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.main>
    </motion.div>
  );
};

export default AgentViewAll;
