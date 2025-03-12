import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CreatePackage from "../components/CreatePackage.jsx";

const CreatePackagePage = () => {
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
      <nav className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex-1"
            >
              <Link to="/AgentHome" className="text-3xl font-bold text-[#1a365d] tracking-tight hover:text-[#4169E1] transition-all duration-300">
                EchoVoyages
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              {[
                { to: "/AgentHome", text: "Home" },
                { to: "/mylistings", text: "My Listings" },
                { to: "/createPackage", text: "Create Package" },
                { to: "/AgentProfilePage", text: "Profile" }
              ].map((link, index) => (
                <motion.div
                  key={link.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      window.location.pathname === link.to
                        ? "bg-[#00072D] text-white shadow-lg hover:bg-[#1a365d]"
                        : "text-[#2d3748] hover:bg-[#4169E1]/10 hover:text-[#4169E1]"
                    }`}
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <CreatePackage />
      </motion.main>
    </motion.div>
  );
};

export default CreatePackagePage;
