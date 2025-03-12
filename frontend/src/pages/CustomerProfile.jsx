import React, { useState, useEffect } from "react";
import CustomerInfo from "../components/CustomerInfo";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const id = jwtDecode(localStorage.getItem("token")).id;
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerResponse = await axios.get(
          `http://localhost:5000/customers/${id}`
        );
        setCustomer(customerResponse.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const bookingsResponse = await axios.get(
          `http://localhost:5000/bookings/${id}`
        );
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchCustomerData();
    fetchBookingsData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      <Navbar />
      <motion.main 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-bold text-center mb-16 text-[#1a365d] tracking-tight"
        >
          Customer Profile
        </motion.h1>

        {customer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8"
          >
            <CustomerInfo customer={customer} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin mx-auto"></div>
            <p className="text-center text-xl text-[#1a365d] mt-4">Loading customer info...</p>
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
};

export default CustomerProfile;
