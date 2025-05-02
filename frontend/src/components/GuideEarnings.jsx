import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const GuideEarnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    received: 0,
    history: []
  });
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const guideId = jwtDecode(localStorage.getItem('token')).id;
  
  useEffect(() => {
    const fetchEarningsData = async () => {
      setLoading(true);
      try {
        // Fetch overall earnings
        const response = await axios.get(`http://localhost:5000/guides/${guideId}/earnings`);
        setEarnings(response.data || {
          total: 0,
          pending: 0,
          received: 0,
          history: []
        });
        
        // Fetch monthly earnings for the current year
        const monthlyResponse = await axios.get(
          `http://localhost:5000/guides/${guideId}/monthly-earnings?year=${currentYear}`
        );
        setMonthlyEarnings(monthlyResponse.data || Array(12).fill(0));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching earnings data:', err);
        setError('Failed to load earnings data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEarningsData();
  }, [guideId, currentYear]);
  
  // Format monthly data for the chart
  const monthlyChartData = monthlyEarnings.map((amount, index) => ({
    month: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
    amount
  }));
  
  // Handle year change
  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };
  
  // Get available years for the dropdown
  const currentYearNum = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYearNum - i);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4169E1]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-white shadow-lg mt-6 border border-gray-100"
    >
      <div className="card-body">
        <h2 className="card-title text-3xl mb-6 text-[#1a365d] text-center">My Earnings</h2>
        
        <div className="stats shadow mb-6">
          <div className="stat">
            <div className="stat-title">Total Earnings</div>
            <div className="stat-value text-[#4169E1]">₹{earnings.total?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-yellow-500">₹{earnings.pending?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Received</div>
            <div className="stat-value text-green-500">₹{earnings.received?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#2d3748]">Monthly Earnings</h3>
            <select 
              className="select select-bordered select-sm"
              value={currentYear}
              onChange={handleYearChange}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                <Legend />
                <Bar dataKey="amount" name="Monthly Earnings" fill="#4169E1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#2d3748]">Payment History</h3>
          {earnings.history && earnings.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Package</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.history.map((item) => (
                    <tr key={item._id} className="hover">
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.packageName || 'N/A'}</td>
                      <td>{item.customerName || 'N/A'}</td>
                      <td>₹{item.amount?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge ${item.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-[#2d3748] mb-2">No payment history available</p>
              <p className="text-sm text-gray-500">
                Your earnings will appear here once you have confirmed bookings.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GuideEarnings;
