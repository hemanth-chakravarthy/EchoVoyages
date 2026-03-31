/** @format */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";
import apiUrl from "../utils/api.js";

const AgencyGuideDirectory = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [requestType, setRequestType] = useState("package_assignment");
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    language: "",
    experience: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");
  const agencyId = token ? jwtDecode(token).id : null;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const guideIdFromUrl = queryParams.get("guideId");

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get(`${apiUrl}/guides`);
        const guidesData = response.data.data || [];
        setGuides(guidesData);

        if (guideIdFromUrl) {
          const guideFromUrl = guidesData.find(
            (guide) => guide._id === guideIdFromUrl
          );
          if (guideFromUrl) {
            setSelectedGuide(guideFromUrl);
            setShowRequestModal(true);
          }
        }
      } catch (err) {
        console.error("Error fetching guides:", err);
        setError("Failed to load guides");
      } finally {
        setLoading(false);
      }
    };

    const fetchPackages = async () => {
      if (agencyId) {
        try {
          const response = await axios.get(
            `${apiUrl}/packages/agents/${agencyId}`
          );
          setPackages(response.data || []);
        } catch (err) {
          console.error("Error fetching packages:", err);
        }
      }
    };

    fetchGuides();
    fetchPackages();
  }, [agencyId, guideIdFromUrl]);

  const locations = [
    ...new Set(guides.map((guide) => guide.location).filter(Boolean)),
  ];
  const languages = [
    ...new Set(guides.flatMap((guide) => guide.languages || [])),
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: filterType === "experience" ? Number(value) : value,
    });
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      language: "",
      experience: 0,
    });
  };

  const filteredGuides = guides.filter((guide) => {
    const locationMatch =
      !filters.location || guide.location === filters.location;
    const languageMatch =
      !filters.language ||
      (guide.languages && guide.languages.includes(filters.language));
    const experienceMatch =
      filters.experience === 0 ||
      (guide.experience && guide.experience >= filters.experience);
    const nameMatch =
      !searchTerm ||
      (guide.name &&
        guide.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return locationMatch && languageMatch && experienceMatch && nameMatch;
  });

  const handleOpenRequestModal = (guide) => {
    setSelectedGuide(guide);
    setShowRequestModal(true);
  };

  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
    setSelectedGuide(null);
    setSelectedPackage("");
    setRequestType("package_assignment");
    setMessage("");
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!agencyId) {
      toast.error("You must be logged in as an agency to send requests");
      return;
    }
    if (!selectedGuide || !selectedGuide._id) {
      toast.error("Invalid guide selection");
      return;
    }
    if (requestType === "package_assignment" && !selectedPackage) {
      toast.error("Please select a package");
      return;
    }
    if (requestType === "package_assignment") {
      const packageExists = packages.some((pkg) => pkg._id === selectedPackage);
      if (!packageExists) {
        toast.error("Selected package is invalid");
        return;
      }
    }
    try {
      const requestData = {
        agencyId,
        guideId: selectedGuide._id,
        message,
        type: requestType,
      };
      if (requestType === "package_assignment") {
        requestData.packageId = selectedPackage;
      }

      try {
        const guideCheckResponse = await axios.get(
          `${apiUrl}/guides/${selectedGuide._id}`
        );
        console.log("Guide check response:", guideCheckResponse.data);
      } catch (guideError) {
        console.error("Error checking guide:", guideError);
        toast.error("Error verifying guide information");
        return;
      }

      if (requestType === "package_assignment") {
        try {
          const packageCheckResponse = await axios.get(
            `${apiUrl}/packages/${selectedPackage}`
          );
          console.log("Package check response:", packageCheckResponse.data);
        } catch (packageError) {
          console.error("Error checking package:", packageError);
          toast.error("Error verifying package information");
          return;
        }
      }

      try {
        const response = await axios.post(
          `${apiUrl}/guide-requests/agency-to-guide`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response:", response.data);
        toast.success("Request sent successfully!");
        handleCloseRequestModal();
      } catch (requestError) {
        console.error("Error sending request:", requestError);
        if (requestError.response?.data?.message) {
          toast.error(requestError.response.data.message);
        } else if (requestError.response?.data?.error) {
          toast.error(`Error: ${requestError.response.data.error}`);
        } else {
          toast.error(
            `Request failed with status ${requestError.response?.status}`
          );
        }
      }
    } catch (err) {
      console.error("Unexpected error in handleSubmitRequest:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <ToastContainer />

      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
          001 / Directory
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
          Guide Directory
        </h1>
        <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
          Find and connect with professional guides for your tours. Discover
          hidden gems around the world and plan unforgettable experiences.
        </p>

        {/* Search Bar */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SEARCH GUIDES..."
            className="bg-transparent border-b border-[#111111]/30 text-[#111111] px-0 py-3 w-full sm:w-96 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] sm:text-xs uppercase tracking-widest placeholder:text-[#111111]/40"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border border-[#111111]/30 text-[#111111] px-6 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300"
          >
            {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-6 md:p-8 border border-[#111111]/10 bg-[#ffffff]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                >
                  <option value="" className="bg-[#ffffff]">ALL LOCATIONS</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#ffffff]">
                      {loc.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange("language", e.target.value)}
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                >
                  <option value="" className="bg-[#ffffff]">ALL LANGUAGES</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang} className="bg-[#ffffff]">
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-2 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                >
                  <option value="0" className="bg-[#ffffff]">ANY EXPERIENCE</option>
                  <option value="1" className="bg-[#ffffff]">1+ YEARS</option>
                  <option value="3" className="bg-[#ffffff]">3+ YEARS</option>
                  <option value="5" className="bg-[#ffffff]">5+ YEARS</option>
                  <option value="10" className="bg-[#ffffff]">10+ YEARS</option>
                </select>
              </div>
            </div>

            {/* Applied Filters */}
            {(filters.location || filters.language || filters.experience > 0) && (
              <div className="mt-6 pt-6 border-t border-[#111111]/10 flex flex-wrap gap-3 items-center">
                <span className="text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase">
                  ACTIVE:
                </span>
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1 border border-[#111111]/30 text-[10px] font-bold uppercase tracking-widest text-[#111111]">
                    {filters.location}
                    <button
                      onClick={() => handleFilterChange("location", "")}
                      className="ml-2 text-[#111111]/60 hover:text-[#111111] transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.language && (
                  <span className="inline-flex items-center px-3 py-1 border border-[#111111]/30 text-[10px] font-bold uppercase tracking-widest text-[#111111]">
                    {filters.language}
                    <button
                      onClick={() => handleFilterChange("language", "")}
                      className="ml-2 text-[#111111]/60 hover:text-[#111111] transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.experience > 0 && (
                  <span className="inline-flex items-center px-3 py-1 border border-[#111111]/30 text-[10px] font-bold uppercase tracking-widest text-[#111111]">
                    {filters.experience}+ YEARS
                    <button
                      onClick={() => handleFilterChange("experience", 0)}
                      className="ml-2 text-[#111111]/60 hover:text-[#111111] transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-4 text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 hover:text-[#111111] transition-colors"
                >
                  CLEAR ALL
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mt-8 mb-6 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase">
            {filteredGuides.length} GUIDE{filteredGuides.length !== 1 ? "S" : ""} FOUND
          </span>
        </div>

        {/* Guide Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
              <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
            </div>
            <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
              Loading Guides...
            </p>
          </div>
        ) : error ? (
          <div className="border border-red-500/30 p-6 md:p-8 text-red-600 text-[10px] uppercase tracking-widest">
            {error}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="border border-[#111111]/10 p-6 md:p-8 text-[#111111]/50 text-[10px] uppercase tracking-widest">
            {filters.location || filters.language || filters.experience > 0
              ? "No guides match your filter criteria."
              : "There are no guides available at the moment."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group border border-[#111111]/10 bg-[#ffffff] hover:border-[#111111]/30 transition-all duration-500"
              >
                <div className="p-6 md:p-8">
                  {/* Guide Avatar & Name */}
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-none border border-[#111111]/20 flex items-center justify-center text-[#111111] text-xl font-bold mr-4 overflow-hidden">
                      {guide.profilePicture ? (
                        <img
                          src={`${apiUrl}/${guide.profilePicture}`}
                          alt={guide.name}
                          className="h-full w-full object-cover"
                        />
                      ) : guide.name ? (
                        guide.name.charAt(0).toUpperCase()
                      ) : (
                        "G"
                      )}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
                        {guide.name}
                      </h3>
                      {guide.location && (
                        <p className="text-[10px] text-[#111111]/50 uppercase tracking-widest mt-1">
                          {guide.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 mb-6">
                    {guide.languages && guide.languages.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                          Languages
                        </p>
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

                    <div>
                      <p className="text-[10px] font-semibold tracking-widest text-[#111111]/40 uppercase mb-2">
                        Experience
                      </p>
                      <p className="text-base md:text-lg font-bold text-[#111111]">
                        {guide.experience || 0}+ YEARS
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenRequestModal(guide)}
                      className="flex-1 bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                    >
                      CONNECT
                    </button>
                    <Link
                      to={`/guides/${guide._id}`}
                      className="flex-1 border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300 text-center"
                    >
                      VIEW
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#ffffff] border border-[#111111]/10 max-w-md w-full"
          >
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#111111]/10">
              <div>
                <span className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-2">
                  Connect With
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111]">
                  {selectedGuide.name}
                </h2>
              </div>
              <button
                onClick={handleCloseRequestModal}
                className="text-[#111111]/50 hover:text-[#111111] transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Request Type
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                >
                  <option value="package_assignment" className="bg-[#ffffff]">
                    PACKAGE ASSIGNMENT
                  </option>
                  <option value="general_inquiry" className="bg-[#ffffff]">
                    GENERAL INQUIRY
                  </option>
                </select>
              </div>

              {requestType === "package_assignment" && (
                <div className="mb-6">
                  <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                    Select Package
                  </label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest"
                  >
                    <option value="" className="bg-[#ffffff]">
                      SELECT A PACKAGE
                    </option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id} className="bg-[#ffffff]">
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-[10px] font-semibold tracking-widest text-[#111111]/50 uppercase mb-3">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows="4"
                  className="w-full bg-transparent border-b border-[#111111]/20 text-[#111111] py-3 focus:border-[#111111] focus:outline-none transition-colors duration-300 text-[10px] uppercase tracking-widest placeholder:text-[#111111]/30 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseRequestModal}
                  className="flex-1 border border-[#111111]/30 text-[#111111] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#f5f3f0] transition-all duration-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#111111] text-[#f5f3f0] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
                >
                  SEND REQUEST
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AgencyGuideDirectory;
