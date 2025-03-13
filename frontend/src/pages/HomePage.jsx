import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching packages from the server
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/packages");
        const data = await response.json();

        if (data && data.data) {
          setPackages(data.data);
        } else {
          console.error("No packages found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px,rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      {/* <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 pointer-events-none"></div> */}

      <Navbar />

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
                    transition: { duration: 0.3 } 
                  }}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative group">
                    {pack.image && pack.image.length > 0 ? (
                      <div className="overflow-hidden">
                        {pack.image.map((img, index) => (
                          <motion.div
                            key={index}
                            className="relative"
                          >
                            <motion.img
                              whileHover={{ scale: 1.08 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              src={`http://localhost:5000${img}`}
                              alt={`Image of ${pack.name}`}
                              className="w-full h-[300px] object-cover transform group-hover:brightness-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.div>
                        ))}
                      </div>
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
                    <p className="text-[#2d3748] mb-6 leading-relaxed line-clamp-3">{pack.description}</p>
                    <div className="flex justify-between items-center mb-6">
                      <motion.p 
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-[#1a365d] bg-blue-50 px-6 py-2 rounded-md"
                      >
                        ${pack.price}
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

