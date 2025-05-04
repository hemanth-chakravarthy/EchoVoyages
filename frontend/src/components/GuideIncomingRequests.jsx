import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const GuideIncomingRequests = ({ onCountChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

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

  const showStatusUpdateModal = (requestId, newStatus) => {
    const action = newStatus === 'approved' ? 'accept' : 'decline';
    const title = newStatus === 'approved' ? 'Accept Request' : 'Decline Request';

    setModalData({
      title: title,
      message: `Are you sure you want to ${action} this request?`,
      onConfirm: async () => {
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
      }
    });

    setIsModalOpen(true);
  };

  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => request.status === activeTab);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a66c2] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading incoming requests...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-[#ffeaea] text-[#d93025] p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalData.onConfirm}
        title={modalData.title}
        message={modalData.message}
      />

      {/* Tabs remain the same */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium text-base ${
            activeTab === 'pending'
              ? 'border-b-2 border-[#0a66c2] text-[#0a66c2] font-semibold'
              : 'text-gray-600 hover:text-[#0a66c2]'
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

      <div className="p-6">
        {requests.length === 0 ? (
          <div className="bg-[#f3f2ef] rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600">No incoming requests from agencies.</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-[#f3f2ef] rounded-lg p-8 text-center">
            <p className="text-gray-600">No {activeTab} requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 max-w-sm"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {request.agencyName || 'Agency'}
                      </h4>
                      {request.type === 'package_assignment' && (
                        <p className="text-sm text-gray-600 mt-1">
                          Package: {request.packageName || 'Unknown Package'}
                        </p>
                      )}
                      {request.type === 'general_collaboration' && (
                        <p className="text-sm text-gray-600 mt-1">
                          Type: General Collaboration Request
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
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
                    <div className="bg-[#f3f2ef] p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    Requested on: {new Date(request.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center space-x-3">
                    {request.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => showStatusUpdateModal(request._id, 'approved')}
                          className="px-4 py-1.5 bg-[#0a66c2] text-white text-sm font-medium rounded-full hover:bg-[#084e96] transition-all duration-300"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => showStatusUpdateModal(request._id, 'rejected')}
                          className="px-4 py-1.5 border border-[#d93025] text-[#d93025] text-sm font-medium rounded-full hover:bg-[#ffeaea] transition-all duration-300"
                        >
                          Decline
                        </motion.button>
                      </>
                    )}

                    {request.type === 'package_assignment' && request.packageId && (
                      <Link to={`/packages/${request.packageId._id || request.packageId}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-1.5 bg-[#0a66c2] text-white text-sm rounded-full hover:bg-[#084e96] transition-colors duration-300"
                        >
                          View Package
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideIncomingRequests;
