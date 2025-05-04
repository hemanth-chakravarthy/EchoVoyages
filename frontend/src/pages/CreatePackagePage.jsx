/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CreatePackage from "../components/CreatePackage.jsx";
import { FaBoxOpen, FaSuitcase } from "react-icons/fa";

const CreatePackagePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f3f6f8]"
    >
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBoxOpen className="text-[#0a66c2] text-2xl" />
            <h1 className="text-3xl font-bold text-[#0a66c2]">
              Create New Package
            </h1>
          </div>
          <p className="text-gray-600 ml-9">
            Design and publish your new travel package
          </p>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <FaSuitcase className="text-[#0a66c2] text-xl" />
              <h2 className="text-xl font-semibold text-gray-900">
                Package Details
              </h2>
            </div>
            <p className="text-gray-600 text-sm mt-1 ml-7">
              Fill in the details for your new travel package
            </p>
          </div>

          <div className="p-6">
            <CreatePackage />
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default CreatePackagePage;
