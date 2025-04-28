import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import GuideIncomingRequests from '../components/GuideIncomingRequests';

const GuideRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('incoming');
  const [incomingCount, setIncomingCount] = useState(0);

  const token = localStorage.getItem('token');
  const guideId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token || !guideId) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/guide-requests', {
          params: {
            guideId,
            initiator: 'guide'
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRequests(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching guide requests:', err);
        setError('Failed to load your guide requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, guideId]);

  const handleCancelRequest = async (requestId) => {
    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return; // User cancelled the operation
    }

    try {
      // Show loading toast
      const loadingToastId = toast.loading("Cancelling request...");

      await axios.delete(`http://localhost:5000/guide-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the request from the list
      setRequests(prevRequests =>
        prevRequests.filter(req => req._id !== requestId)
      );

      // Update loading toast to success
      toast.update(loadingToastId, {
        render: "Request cancelled successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error('Error cancelling guide request:', err);
      toast.error('Failed to cancel request: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a365d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your guide requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a365d]">Guide Requests</h1>
        {/* <Link to="/GuideHome">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-[#1a365d] text-white rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
          >
            Back to Dashboard
          </motion.button>
        </Link> */}
      </div>

      {/* Section Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium text-lg ${
            activeSection === 'incoming'
              ? 'border-b-2 border-[#1a365d] text-[#1a365d] font-bold'
              : 'text-gray-500 hover:text-[#1a365d]'
          }`}
          onClick={() => setActiveSection('incoming')}
        >
          Incoming Requests
          {incomingCount > 0 && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {incomingCount}
            </span>
          )}
        </button>
        <button
          className={`px-6 py-3 font-medium text-lg ${
            activeSection === 'outgoing'
              ? 'border-b-2 border-[#1a365d] text-[#1a365d] font-bold'
              : 'text-gray-500 hover:text-[#1a365d]'
          }`}
          onClick={() => setActiveSection('outgoing')}
        >
          Sent Requests
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
            {requests.length}
          </span>
        </button>
      </div>

      {/* Incoming Requests Section */}
      {activeSection === 'incoming' && (
        <div className="mb-10">
          <GuideIncomingRequests onCountChange={setIncomingCount} />
        </div>
      )}

      {/* Outgoing Requests Section */}
      {activeSection === 'outgoing' && (
        <div>
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          ) : requests.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Outgoing Requests</h2>
              <p className="text-gray-600 mb-6">
                You haven't requested to guide any packages yet.
              </p>
              <Link to="/home">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-[#1a365d] text-white rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                >
                  Browse Packages
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-[#1a365d]">
                        {request.packageName || 'Package'}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    {request.message && (
                      <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600 mb-4">
                      <p>Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
                      {request.status !== 'pending' && (
                        <p>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)} on:{' '}
                          {new Date(request.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <Link to={`/packages/${request.packageId._id || request.packageId}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1 bg-[#1a365d] text-white text-sm rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                        >
                          View Package
                        </motion.button>
                      </Link>

                      {request.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancelRequest(request._id)}
                          className="px-4 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                        >
                          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg> */}
                          Cancel
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideRequests;
