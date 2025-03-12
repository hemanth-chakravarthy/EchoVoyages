import React from "react";
import AgentInfo from "../components/AgentInfo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AgentProfilePage = () => {
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
      <div className="navbar bg-white shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-[#1a365d]">EchoVoyages</a>
        </div>
        <div className="flex-none gap-2">
          <div className="flex space-x-4">
            <Link to="/AgentHome" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              Home Page
            </Link>
            <Link to="/mylistings" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              My Listings
            </Link>
            <Link to="/createPackage" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              Create Package
            </Link>
            <Link to="/AgentProfilePage" className="btn btn-ghost text-[#2d3748] hover:text-[#1a365d]">
              Profile Page
            </Link>
          </div>
        </div>
      </div>

      <motion.main 
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-center font-bold text-4xl mb-8 tracking-tight">
              <span className="text-black">Agent</span>
              <span className="bg-gradient-to-r from-[#1a365d] to-[#4169E1] text-transparent bg-clip-text"> Profile</span>
            </h1>
            <div className="bg-white/90 rounded-xl p-6 shadow-inner">
              <AgentInfo />
            </div>
          </motion.div>
        </div>
      </motion.main>
    </motion.div>
  );
};

export default AgentProfilePage;
