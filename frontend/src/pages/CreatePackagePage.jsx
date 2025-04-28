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
      {/* Navbar removed - now using RoleBasedNavbar from Layout component */}

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
