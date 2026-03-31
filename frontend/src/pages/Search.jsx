/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaClock, FaUsers, FaDollarSign, FaGlobe, FaCalendarAlt } from "react-icons/fa";
import apiUrl from "../utils/api.js";

const Search = () => {
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [entityType, setEntityType] = useState("");
  const [availability, setAvailability] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minGroupSize, setMinGroupSize] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [guideRes, packageRes] = await Promise.all([
          axios.get(`${apiUrl}/search/guide-locations`),
          axios.get(`${apiUrl}/search/package-locations`),
        ]);
        setLocations([
          ...new Set([...guideRes.data.locations, ...packageRes.data]),
        ]);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const res = await axios.get(`${apiUrl}/search/guide-languages`);
        setLanguages(res.data || []);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLocations();
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    if (entityType) {
      try {
        const res = await axios.get(`${apiUrl}/search`, {
          params: {
            location: selectedLocation,
            entityType,
            availability,
            language: selectedLanguage,
            minDuration,
            maxDuration,
            minGroupSize,
            maxGroupSize,
            minPrice,
            maxPrice,
            availableDates,
          },
        });
        setSearchResults(res.data || []);
        setHasSearched(true);
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            003 / Discovery Engine
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            Search
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Find the perfect guide or travel package. Filter by location, price,
            duration, and more to discover your next voyage.
          </p>
        </div>

        {/* Search Panel */}
        <div className="border border-[#111111]/10 bg-[#ffffff] mb-12">
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Location */}
              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                >
                  <option value="" className="bg-[#ffffff]">ALL LOCATIONS</option>
                  {locations.filter(Boolean).map((loc, index) => (
                    <option key={index} value={loc} className="bg-[#ffffff]">
                      {loc.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Type */}
              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Search Type
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                >
                  <option value="" className="bg-[#ffffff]">SELECT TYPE</option>
                  <option value="Guide" className="bg-[#ffffff]">GUIDE</option>
                  <option value="Package" className="bg-[#ffffff]">PACKAGE</option>
                </select>
              </div>

              {/* Guide-specific filters */}
              {entityType === "Guide" && (
                <>
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={availability}
                          onChange={(e) => setAvailability(e.target.checked)}
                        />
                        <div className="w-10 h-5 bg-[#111111]/10 rounded-none peer-checked:bg-[#111111] transition-colors"></div>
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-[#f5f3f0] peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70">
                        Available Only
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                      Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                    >
                      <option value="" className="bg-[#ffffff]">ALL LANGUAGES</option>
                      {languages.filter(Boolean).map((lang, index) => (
                        <option key={index} value={lang} className="bg-[#ffffff]">
                          {lang.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Package-specific filters */}
            {entityType === "Package" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#111111]/10">
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                    Duration (Days)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="MIN"
                      value={minDuration}
                      onChange={(e) => setMinDuration(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-1/2 bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest placeholder:text-[#111111]/30"
                    />
                    <input
                      type="number"
                      placeholder="MAX"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-1/2 bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest placeholder:text-[#111111]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                    Price Range
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="MIN"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-1/2 bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest placeholder:text-[#111111]/30"
                    />
                    <input
                      type="number"
                      placeholder="MAX"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-1/2 bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest placeholder:text-[#111111]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                    Available Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setAvailableDates([
                        ...availableDates,
                        moment(e.target.value).format("YYYY-MM-DD"),
                      ])
                    }
                    className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                  />
                </div>
              </div>
            )}

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-8 w-full bg-[#111111] text-[#f5f3f0] py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={!entityType}
            >
              <FaSearch className="text-sm" />
              Search
            </motion.button>
          </div>
        </div>

        {/* Results Count */}
        {hasSearched && (
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase">
              {searchResults.length} RESULT{searchResults.length !== 1 ? "S" : ""} FOUND
            </span>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <motion.div
                key={result._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group border border-[#111111]/10 bg-[#ffffff] hover:border-[#111111]/30 transition-all duration-500"
              >
                <div className="p-6 md:p-8">
                  {entityType === "Package" && (
                    <div className="mb-6 overflow-hidden">
                      {result.image && result.image.length > 0 ? (
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          src={
                            result.image[0].startsWith("http")
                              ? result.image[0]
                              : `${apiUrl}${result.image[0]}`
                          }
                          alt={result.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-[#f0eeeb] flex items-center justify-center">
                          <FaMapMarkerAlt className="text-[#111111]/10 text-4xl" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111] mb-6">
                    {result.name || result.username || "UNNAMED"}
                  </h3>

                  {/* Guide Details */}
                  {entityType === "Guide" && (
                    <div className="space-y-4 mb-6">
                      {result.experience && (
                        <div className="flex items-center gap-3">
                          <FaClock className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                              Experience
                            </p>
                            <p className="text-sm font-bold text-[#111111]">
                              {result.experience} YEARS
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 ${result.availability ? "bg-green-500" : "bg-red-500"}`}></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70">
                          {result.availability ? "Available" : "Unavailable"}
                        </p>
                      </div>

                      {result.languages && Array.isArray(result.languages) && result.languages.length > 0 && (
                        <div className="flex items-start gap-3">
                          <FaGlobe className="text-[#111111]/30 text-xs mt-1" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-1">
                              Languages
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.languages.map((lang, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 border border-[#111111]/20 text-[10px] font-bold uppercase tracking-widest text-[#111111]/70"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {result.location && (
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                              Location
                            </p>
                            <p className="text-sm font-bold text-[#111111]">
                              {result.location.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Package Details */}
                  {entityType === "Package" && (
                    <div className="space-y-4 mb-6">
                      {result.duration && (
                        <div className="flex items-center gap-3">
                          <FaClock className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                              Duration
                            </p>
                            <p className="text-sm font-bold text-[#111111]">
                              {result.duration} DAYS
                            </p>
                          </div>
                        </div>
                      )}

                      {result.maxGroupSize && (
                        <div className="flex items-center gap-3">
                          <FaUsers className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                              Max Group Size
                            </p>
                            <p className="text-sm font-bold text-[#111111]">
                              {result.maxGroupSize}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.price && (
                        <div className="flex items-center gap-3">
                          <FaDollarSign className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                              Price
                            </p>
                            <p className="text-sm font-bold text-[#111111]">
                              ₹{result.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.availableDates && Array.isArray(result.availableDates) && result.availableDates.length > 0 && (
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="text-[#111111]/30 text-xs mt-1" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-1">
                              Available Dates
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70">
                              {result.availableDates
                                .map((date) => moment(date).format("MMM DD, YYYY"))
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.location && (
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-[#111111]/30 text-xs" />
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase">
                              Location
                            </p>
                            <p className="text-sm font-bold text-[#111111]">
                              {result.location.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    to={entityType === "Guide" ? `/guides/${result._id}` : `/packages/${result._id}`}
                    className="block w-full bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 text-center"
                  >
                    {entityType === "Guide" ? "View Guide" : "View Package"}
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            hasSearched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full border border-[#111111]/10 p-8 md:p-16 text-center"
              >
                <FaSearch className="w-16 h-16 text-[#111111]/20 mx-auto mb-6" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
                  No Results Found
                </h2>
                <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest">
                  Try adjusting your filters to discover more options.
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Search;
