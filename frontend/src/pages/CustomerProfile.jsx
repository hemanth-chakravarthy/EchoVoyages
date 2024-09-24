import React, { useState, useEffect } from 'react';
import CustomerInfo from '../components/CustomerInfo';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; // For navigation after logout
import axios from 'axios';
import "../styles/CustomerProfile.css";
import "../styles/Navbar.css";

const CustomerProfile = () => {
    const navigate = useNavigate();
    const id = jwtDecode(localStorage.getItem('token')).id;
    const [customer, setCustomer] = useState(null); // Initially set to null
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch customer data from API
        const fetchCustomerData = async () => {
            try {
                const customerResponse = await axios.get(`http://localhost:5000/customers/${id}`);
                setCustomer(customerResponse.data);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        // Fetch bookings data from API
        const fetchBookingsData = async () => {
            try {
                const bookingsResponse = await axios.get(`http://localhost:5000/bookings/${id}`);
                setBookings(bookingsResponse.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchCustomerData();
        fetchBookingsData();
    }, []);

    // Logout function
    
    return (
        <div className="profile-page">
            {/* Navbar Component */}
            <Navbar/>

            {/* Customer Info */}
            {customer ? <CustomerInfo customer={customer} /> : <p>Loading customer info...</p>}
        </div>
    );
};

export default CustomerProfile;
