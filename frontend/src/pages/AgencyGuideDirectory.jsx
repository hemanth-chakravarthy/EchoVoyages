import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useLocation } from 'react-router-dom';

const AgencyGuideDirectory = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [requestType, setRequestType] = useState('package_assignment');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const agencyId = token ? jwtDecode(token).id : null;

  // Get query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const guideIdFromUrl = queryParams.get('guideId');

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/guides');
        const guidesData = response.data.data || [];
        setGuides(guidesData);

        // If there's a guideId in the URL, find and select that guide
        if (guideIdFromUrl) {
          const guideFromUrl = guidesData.find(guide => guide._id === guideIdFromUrl);
          if (guideFromUrl) {
            setSelectedGuide(guideFromUrl);
            setShowRequestModal(true);
          }
        }
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load guides');
      } finally {
        setLoading(false);
      }
    };

    const fetchPackages = async () => {
      if (agencyId) {
        try {
          console.log('Fetching packages for agency ID:', agencyId);
          const response = await axios.get(`http://localhost:5000/packages/agents/${agencyId}`);
          console.log('Packages response:', response.data);
          setPackages(response.data || []);
        } catch (err) {
          console.error('Error fetching packages:', err);
          console.error('Error details:', err.response?.data || err.message);
        }
      } else {
        console.warn('No agency ID available to fetch packages');
      }
    };

    fetchGuides();
    fetchPackages();
  }, [agencyId, guideIdFromUrl]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredGuides = guides.filter(guide =>
    guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.languages?.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase())) ||
    guide.experience?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRequestModal = (guide) => {
    setSelectedGuide(guide);
    setShowRequestModal(true);
  };

  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
    setSelectedGuide(null);
    setSelectedPackage('');
    setRequestType('package_assignment');
    setMessage('');
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!agencyId) {
      toast.error('You must be logged in as an agency to send requests');
      console.error('No agency ID available');
      return;
    }

    if (!selectedGuide || !selectedGuide._id) {
      toast.error('Invalid guide selection');
      console.error('Invalid guide:', selectedGuide);
      return;
    }

    if (requestType === 'package_assignment') {
      if (!selectedPackage) {
        toast.error('Please select a package');
        console.error('No package selected for package assignment');
        return;
      }

      // Validate that the selected package exists
      const packageExists = packages.some(pkg => pkg._id === selectedPackage);
      if (!packageExists) {
        toast.error('Selected package is invalid');
        console.error('Invalid package ID:', selectedPackage);
        return;
      }
    }

    try {
      console.log('Selected guide:', selectedGuide);
      console.log('Selected package:', selectedPackage);

      const requestData = {
        agencyId,
        guideId: selectedGuide._id,
        message,
        type: requestType
      };

      if (requestType === 'package_assignment') {
        requestData.packageId = selectedPackage;
      }

      console.log('Sending request data:', requestData);

      // First, check if the guide exists
      try {
        const guideCheckResponse = await axios.get(`http://localhost:5000/guides/${selectedGuide._id}`);
        console.log('Guide check response:', guideCheckResponse.data);
      } catch (guideError) {
        console.error('Error checking guide:', guideError);
        toast.error('Error verifying guide information');
        return;
      }

      // If it's a package assignment, check if the package exists
      if (requestType === 'package_assignment') {
        try {
          const packageCheckResponse = await axios.get(`http://localhost:5000/packages/${selectedPackage}`);
          console.log('Package check response:', packageCheckResponse.data);
        } catch (packageError) {
          console.error('Error checking package:', packageError);
          toast.error('Error verifying package information');
          return;
        }
      }

      // Now send the request
      try {
        const response = await axios.post(
          'http://localhost:5000/guide-requests/agency-to-guide',
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Response:', response.data);
        toast.success('Request sent successfully!');
        handleCloseRequestModal();
        return;
      } catch (requestError) {
        console.error('Error sending request:', requestError);

        if (requestError.response) {
          console.error('Response error data:', requestError.response.data);
          console.error('Response status:', requestError.response.status);

          if (requestError.response.data && requestError.response.data.message) {
            toast.error(requestError.response.data.message);
          } else if (requestError.response.data && requestError.response.data.error) {
            toast.error(`Error: ${requestError.response.data.error}`);
          } else {
            toast.error(`Request failed with status ${requestError.response.status}`);
          }
        } else if (requestError.request) {
          console.error('Request error:', requestError.request);
          toast.error('No response received from server. Please check your connection.');
        } else {
          console.error('Error message:', requestError.message);
          toast.error('Failed to send request. Please try again later.');
        }
        return;
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmitRequest:', err);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a365d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a365d]">Guide Directory</h1>
        {/* <Link to="/AgentHome">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-[#1a365d] text-white rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
          >
            Back to Dashboard
          </motion.button>
        </Link> */}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search guides by name, location, languages, or experience..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Guides Found</h2>
          <p className="text-gray-600">
            {searchTerm ? "No guides match your search criteria." : "There are no guides available at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <motion.div
              key={guide._id}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#1a365d] mb-2">{guide.name}</h2>

                <div className="flex items-center mb-3">
                  <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-yellow-700 font-bold mr-1">
                      {guide.ratings && guide.ratings.averageRating > 0
                        ? guide.ratings.averageRating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-yellow-700">★</span>
                    <span className="text-gray-600 ml-2 text-sm">
                      ({guide.ratings ? guide.ratings.numberOfReviews : 0} {guide.ratings && guide.ratings.numberOfReviews === 1 ? "rating" : "ratings"})
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Location:</span> {guide.location}
                </p>

                {guide.languages && guide.languages.length > 0 && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Languages:</span>{" "}
                    {guide.languages.join(", ")}
                  </p>
                )}

                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Experience:</span> {guide.experience}
                </p>

                <div className="flex justify-between items-center">
                  <Link to={`/guides/${guide._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-1 bg-[#1a365d] text-white text-sm rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                    >
                      View Profile
                    </motion.button>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenRequestModal(guide)}
                    className="px-3 py-1 bg-[#4169E1] text-white text-sm rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                  >
                    Send Request
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-[#1a365d] mb-4">
              Send Request to {selectedGuide.name}
            </h2>

            <form onSubmit={handleSubmitRequest}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                >
                  <option value="package_assignment">Assign to Package</option>
                  <option value="general_collaboration">General Collaboration</option>
                </select>
              </div>

              {requestType === 'package_assignment' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Package
                  </label>
                  {packages.length > 0 ? (
                    <select
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      required
                    >
                      <option value="">Select a package</option>
                      {packages.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-red-500 text-sm">
                      You don't have any packages. Please create a package first.
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  rows="4"
                  placeholder="Explain why you'd like to work with this guide..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseRequestModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-md text-white ${
                    requestType === 'package_assignment' && (!packages.length || !selectedPackage)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#1a365d] hover:bg-[#2d4a7e] transition-colors duration-300'
                  }`}
                  disabled={requestType === 'package_assignment' && (!packages.length || !selectedPackage)}
                >
                  Send Request
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AgencyGuideDirectory;
