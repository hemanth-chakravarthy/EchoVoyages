/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaUser, FaLanguage, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import apiUrl from "../utils/api.js";

const CustomerGuide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch(`${apiUrl}/guides`);
        const data = await response.json();
        if (data && data.data) {
          setGuides(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
          </div>
          <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
            Loading Guides...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            008 / Guide Directory
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            Our Guides
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Discover experienced guides ready to lead your next adventure.
            Browse profiles and find the perfect match for your journey.
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase">
            {guides.length} GUIDE{guides.length !== 1 ? "S" : ""} AVAILABLE
          </span>
        </div>

        {/* Guide Cards */}
        {guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {guides.map((guide, index) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group border border-[#111111]/10 bg-[#ffffff] hover:border-[#111111]/30 transition-all duration-500"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  {guide.profilePicture ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={`${apiUrl}/${guide.profilePicture}`}
                      alt={guide.name || guide.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f0eeeb] flex items-center justify-center">
                      <FaUser className="text-[#111111]/10 text-5xl" />
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  {/* Name & Rating */}
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
                      {guide.name || guide.username}
                    </h2>
                    <div className="flex items-center gap-2 px-3 py-1 border border-[#111111]/20">
                      <FaStar className="text-yellow-500 text-xs" />
                      <span className="text-[10px] font-bold text-[#111111]">
                        {guide.ratings && guide.ratings.averageRating > 0
                          ? guide.ratings.averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 mb-6">
                    {guide.location && (
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-[#111111]/30 text-xs" />
                        <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                          {guide.location}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <FaBriefcase className="text-[#111111]/30 text-xs" />
                      <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                        {guide.experience || 0} YEARS EXPERIENCE
                      </p>
                    </div>

                    {guide.languages && guide.languages.length > 0 && (
                      <div className="flex items-start gap-3">
                        <FaLanguage className="text-[#111111]/30 text-xs mt-1" />
                        <div className="flex flex-wrap gap-2">
                          {guide.languages.map((lang, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 border border-[#111111]/20 text-[10px] font-bold uppercase tracking-widest text-[#111111]/70"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Link
                    to={`/guides/${guide._id}`}
                    className="block w-full bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 text-center"
                  >
                    View Guide
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-[#111111]/10 p-8 md:p-16 text-center">
            <FaUser className="w-16 h-16 text-[#111111]/20 mx-auto mb-6" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
              No Guides Available
            </h2>
            <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
              Check back later for available guides.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerGuide;
