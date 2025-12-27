/** @format */
import { useState, useEffect } from "react";
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

  const token = localStorage.getItem("token");
  const agencyId = token ? jwtDecode(token).id : null;

  // Get query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const guideIdFromUrl = queryParams.get("guideId");

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get(`${apiUrl}/guides`);
        const guidesData = response.data.data || [];
        setGuides(guidesData);

        // If there's a guideId in the URL, find and select that guide
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
          console.log("Fetching packages for agency ID:", agencyId);
          const response = await axios.get(
            `${apiUrl}/packages/agents/${agencyId}`
          );
          console.log("Packages response:", response.data);
          setPackages(response.data || []);
        } catch (err) {
          console.error("Error fetching packages:", err);
          console.error("Error details:", err.response?.data || err.message);
        }
      } else {
        console.warn("No agency ID available to fetch packages");
      }
    };

    fetchGuides();
    fetchPackages();
  }, [agencyId, guideIdFromUrl]);

  // Get unique locations and languages for filters
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
      console.error("No agency ID available");
      return;
    }
    if (!selectedGuide || !selectedGuide._id) {
      toast.error("Invalid guide selection");
      console.error("Invalid guide:", selectedGuide);
      return;
    }
    if (requestType === "package_assignment") {
      if (!selectedPackage) {
        toast.error("Please select a package");
        console.error("No package selected for package assignment");
        return;
      }
      // Validate that the selected package exists
      const packageExists = packages.some((pkg) => pkg._id === selectedPackage);
      if (!packageExists) {
        toast.error("Selected package is invalid");
        console.error("Invalid package ID:", selectedPackage);
        return;
      }
    }
    try {
      console.log("Selected guide:", selectedGuide);
      console.log("Selected package:", selectedPackage);
      const requestData = {
        agencyId,
        guideId: selectedGuide._id,
        message,
        type: requestType,
      };
      if (requestType === "package_assignment") {
        requestData.packageId = selectedPackage;
      }
      console.log("Sending request data:", requestData);

      // First, check if the guide exists
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

      // If it's a package assignment, check if the package exists
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

      // Now send the request
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
        return;
      } catch (requestError) {
        console.error("Error sending request:", requestError);
        if (requestError.response) {
          console.error("Response error data:", requestError.response.data);
          console.error("Response status:", requestError.response.status);
          if (
            requestError.response.data &&
            requestError.response.data.message
          ) {
            toast.error(requestError.response.data.message);
          } else if (
            requestError.response.data &&
            requestError.response.data.error
          ) {
            toast.error(`Error: ${requestError.response.data.error}`);
          } else {
            toast.error(
              `Request failed with status ${requestError.response.status}`
            );
          }
        } else if (requestError.request) {
          console.error("Request error:", requestError.request);
          toast.error(
            "No response received from server. Please check your connection."
          );
        } else {
          console.error("Error message:", requestError.message);
          toast.error("Failed to send request. Please try again later.");
        }
        return;
      }
    } catch (err) {
      console.error("Unexpected error in handleSubmitRequest:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-[#f3f6f8] min-h-screen font-sans">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0077B5] mb-2">
            Guide Directory
          </h1>
          <p className="text-gray-600">
            Find and connect with professional guides for your tours
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filters
            </h3>

            {/* Applied filters */}
            {(filters.location ||
              filters.language ||
              filters.experience > 0) && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Applied Filters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.location && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Location: {filters.location}
                      <button
                        onClick={() => handleFilterChange("location", "")}
                        className="ml-1.5 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.language && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Language: {filters.language}
                      <button
                        onClick={() => handleFilterChange("language", "")}
                        className="ml-1.5 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.experience > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Experience: {filters.experience}+ years
                      <button
                        onClick={() => handleFilterChange("experience", 0)}
                        className="ml-1.5 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#0077B5] hover:text-[#005885] mt-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Filter Form */}
            <div className="filter-section pb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search guides..."
                className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) =>
                    handleFilterChange("language", e.target.value)
                  }
                  className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                >
                  <option value="">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) =>
                    handleFilterChange("experience", e.target.value)
                  }
                  className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                >
                  <option value="0">Any Experience</option>
                  <option value="1">1+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guide Cards */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B5]"></div>
                <p className="mt-4 text-gray-600">Loading guides...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  {filters.location ||
                  filters.language ||
                  filters.experience > 0
                    ? "No guides match your filter criteria."
                    : "There are no guides available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <motion.div
                    key={guide._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <div className="h-14 w-14 rounded-full bg-[#0077B5] flex items-center justify-center text-white text-xl font-semibold mr-3">
                          {guide.profilePicture ? (
                            <img
                              src={`${apiUrl}/${guide.profilePicture}`}
                              alt={guide.name}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : guide.name ? (
                            guide.name.charAt(0).toUpperCase()
                          ) : (
                            "G"
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {guide.name}
                          </h3>
                          {guide.location && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              {guide.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {guide.languages && guide.languages.length > 0 && (
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 mr-2 text-gray-500 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l-.31 1.242c-.413 1.65-1.717 2.852-3.349 3.003L5.9 13.9l3.4.9a1 1 0 01.8 1.22l-.4 1.8a1 1 0 01-1.2.8l-7-1.8a1 1 0 01-.8-1.2l1.8-7a1 1 0 011.2-.8l1.8.4a1 1 0 01.8 1.2L5.8 8.4c.5-.1.9-.5 1.1-1l.9-3.4a1 1 0 011-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Languages
                              </p>
                              <p className="text-sm text-gray-600">
                                {guide.languages.join(", ")}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Experience
                            </p>
                            <p className="text-sm text-gray-600">
                              {guide.experience || 0} years
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 w-full">
                        <button
                          onClick={() => handleOpenRequestModal(guide)}
                          className="flex-1 bg-[#0077B5] hover:bg-[#005885] text-white font-medium rounded-full transition-colors duration-300 flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                          </svg>
                        </button>

                        <Link
                          to={`/guides/${guide._id}`}
                          className="flex-1 bg-white border border-[#0077B5] text-[#0077B5] hover:bg-gray-50 font-medium py-2 px-4 rounded-full transition-colors duration-300 flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          View Guide
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Connect with {selectedGuide.name}
              </h2>
              <button
                onClick={handleCloseRequestModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                >
                  <option value="package_assignment">Package Assignment</option>
                  <option value="general_inquiry">General Inquiry</option>
                </select>
              </div>

              {requestType === "package_assignment" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Package
                  </label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                  >
                    <option value="">Select a package</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message to the guide..."
                  rows="4"
                  className="p-2 w-full max-w-md text-sm bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseRequestModal}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0077B5] hover:bg-[#005885] text-white rounded-full font-medium"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyGuideDirectory;
