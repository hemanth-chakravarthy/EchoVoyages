import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const GuideIncomingRequests = ({ onCountChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

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
            initiator: 'agency'
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const incomingRequests = response.data.data || [];
        setRequests(incomingRequests);

        // Call the onCountChange callback with the count of pending requests
        if (onCountChange) {
          const pendingCount = incomingRequests.filter(req => req.status === 'pending').length;
          onCountChange(pendingCount);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching incoming requests:', err);
        setError('Failed to load incoming requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, guideId]);

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

      // Update the local state
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );

      toast.success(`Request ${newStatus} successfully`);
    } catch (err) {
      console.error(`Error ${newStatus} request:`, err);
      toast.error(`Failed to ${newStatus} request`);
    }
  };

  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => request.status === activeTab);

  if (loading) {
    return <div className="text-center py-4">Loading incoming requests...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="text-xl font-bold text-[#1a365d] mb-4">
        Incoming Requests from Agencies
      </h3>

      {/* Tabs */}
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
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {requests.filter(r => r.status === 'pending').length}
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

      {requests.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No incoming requests from agencies.</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            No {activeTab} requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">
                    {request.agencyName || 'Agency'}
                  </h4>
                  {request.type === 'package_assignment' && (
                    <p className="text-sm text-gray-600">
                      Package: {request.packageName || 'Unknown Package'}
                    </p>
                  )}
                  {request.type === 'general_collaboration' && (
                    <p className="text-sm text-gray-600">
                      Type: General Collaboration Request
                    </p>
                  )}
                </div>
                <div className="flex items-center">
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
              </div>

              {request.message && (
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mb-3">
                Requested on: {new Date(request.createdAt).toLocaleDateString()}
              </p>

              {request.status === 'pending' && (
                <div className="flex space-x-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusUpdate(request._id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Accept
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Decline
                  </motion.button>
                </div>
              )}

              {request.type === 'package_assignment' && request.packageId && (
                <div className="mt-3">
                  <Link to={`/packages/${request.packageId._id || request.packageId}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-1 bg-[#1a365d] text-white text-sm rounded-md hover:bg-[#2d4a7e] transition-colors duration-300"
                    >
                      View Package
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuideIncomingRequests;
