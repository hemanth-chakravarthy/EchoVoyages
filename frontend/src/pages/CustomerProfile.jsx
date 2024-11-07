import React, { useState, useEffect } from 'react';
import CustomerInfo from '../components/CustomerInfo';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import "../styles/CustomerProfile.css";
import "../styles/Navbar.css";

const CustomerProfile = () => {
    const navigate = useNavigate();
    const id = jwtDecode(localStorage.getItem('token')).id;
    const [customer, setCustomer] = useState(null); 
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const customerResponse = await axios.get(`http://localhost:5000/customers/${id}`);
                setCustomer(customerResponse.data);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

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


    
    return (
        <div className="profile-page">
            <Navbar/>
            {customer ? <CustomerInfo customer={customer} /> : <p>Loading customer info...</p>}
            
        </div>
    );
};

export default CustomerProfile;
