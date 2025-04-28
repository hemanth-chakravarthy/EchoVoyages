import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const AgencyGuideRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('incoming');

  const token = localStorage.getItem('token');
  const agencyId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token || !agencyId) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        // Fetch incoming requests (guide to agency)
        const incomingResponse = await axios.get('http://localhost:5000/guide-requests', {
          params: {
            agencyId,
            initiator: 'guide' // Requests initiated by guides
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch outgoing requests (agency to guide)
        const outgoingResponse = await axios.get('http://localhost:5000/guide-requests', {
          params: {
            agencyId,
            initiator: 'agency' // Requests initiated by this agency
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIncomingRequests(incomingResponse.data.data || []);
        setOutgoingRequests(outgoingResponse.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching guide requests:', err);
        setError('Failed to load guide requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, agencyId]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/guide-requests/${requestId}`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the local state for incoming requests
      setIncomingRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );

      toast.success(`Request ${newStatus} successfully`);
    } catch (err) {
      console.error(`Error ${newStatus} guide request:`, err);
      toast.error(`Failed to ${newStatus} request`);
    }
  };

  const handleCancelRequest = async (requestId, guideName) => {
    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to cancel your request to ${guideName}?`)) {
      return; // User cancelled the operation
    }

    try {
      // Show loading toast
      const loadingToastId = toast.loading("Cancelling request...");

      // Delete the request from the database
      await axios.delete(`http://localhost:5000/guide-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the request from the local state
      setOutgoingRequests(prevRequests =>
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

  // Get the appropriate requests based on active section
  const requests = activeSection === 'incoming' ? incomingRequests : outgoingRequests;

  // Filter requests based on active tab (only for incoming requests)
  const filteredRequests = activeSection === 'incoming'
    ? requests.filter(request => request.status === activeTab)
    : requests;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a365d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading guide requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a365d]">Guide Requests</h1>
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

      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
        <>
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
              {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {incomingRequests.filter(r => r.status === 'pending').length}
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
              {outgoingRequests.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {outgoingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Status Tabs - Only show for incoming requests */}
          {activeSection === 'incoming' && (
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-[#1a365d] text-[#1a365d]'
                    : 'text-gray-500 hover:text-[#1a365d]'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
                {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {incomingRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'approved'
                    ? 'border-b-2 border-[#1a365d] text-[#1a365d]'
                    : 'text-gray-500 hover:text-[#1a365d]'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                Approved
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'rejected'
                    ? 'border-b-2 border-[#1a365d] text-[#1a365d]'
                    : 'text-gray-500 hover:text-[#1a365d]'
                }`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected
              </button>
            </div>
          )}

          {filteredRequests.length === 0 ? (
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
              {activeSection === 'incoming' ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'pending'
                      ? "You don't have any pending guide requests."
                      : activeTab === 'approved'
                      ? "You haven't approved any guide requests yet."
                      : "You haven't rejected any guide requests yet."}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No Sent Requests
                  </h2>
                  <p className="text-gray-600">
                    You haven't sent any requests to guides yet.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a365d]">
                          {request.packageName || 'Package'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Guide: {request.guideName || 'Unknown Guide'}
                        </p>
                      </div>
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
                      {request.packageId && (
                        <Link to={`/packages/${
                          typeof request.packageId === 'object' && request.packageId !== null
                            ? request.packageId._id
                            : request.packageId
                        }`}>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-3 py-1 bg-[#1a365d] text-white text-sm rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                          >
                            View Package
                          </motion.button>
                        </Link>
                      )}

                      {/* Only show approve/reject buttons for incoming requests that are pending */}
                      {activeSection === 'incoming' && request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(request._id, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-300"
                          >
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(request._id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-300"
                          >
                            Reject
                          </motion.button>
                        </div>
                      )}

                      {/* For outgoing requests */}
                      {activeSection === 'outgoing' && (
                        <div className="flex items-center space-x-3">
                          {/* Status indicator */}
                          {/* <div className={`px-3 py-1 text-sm rounded-md font-medium ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </div> */}

                          {/* Cancel button for pending requests */}
                          {request.status === 'pending' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelRequest(request._id, request.guideName || 'this guide')}
                              className="px-4 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                            >
                              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> */}
                              {/* </svg> */} 
                              Cancel Request
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgencyGuideRequests;
