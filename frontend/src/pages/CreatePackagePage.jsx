/** @format */

import { motion } from "framer-motion";
import CreatePackage from "../components/CreatePackage.jsx";
import { FaBoxOpen, FaSuitcase } from "react-icons/fa";

const CreatePackagePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs"
    >
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24"
      >
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            004 / Package Creation
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            Create Package
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Design and publish your new travel package. Fill in the details below
            to bring your vision to life.
          </p>
        </div>

        {/* Content */}
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="border border-[#111111]/10 bg-[#ffffff]"
        >
          <div className="flex items-center gap-3 p-6 md:p-8 border-b border-[#111111]/10">
            <FaBoxOpen className="text-[#111111]/40 text-lg" />
            <div>
              <h2 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
                Package Details
              </h2>
              <p className="text-[10px] text-[#111111]/50 uppercase tracking-widest mt-1">
                Fill in the details for your new travel package
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <CreatePackage />
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default CreatePackagePage;
