import React, { useState, useEffect } from 'react';
import CustomerInfo from '../components/CustomerInfo';
import BookingList from '../components/BookingList';
import Navbar from '../components/Navbar';
import "../styles/CustomerProfile.css";
import "../styles/Navbar.css";
import axios from 'axios';

const ProfilePage = () => {
    const [customer, setCustomer] = useState(null); // Initially set to null
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch customer data from API
        const fetchCustomerData = async () => {
            try {
                const customerResponse = await axios.get('/api/customer/123'); // Replace 123 with actual customer ID or auth token
                setCustomer(customerResponse.data);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        // Fetch bookings data from API
        const fetchBookingsData = async () => {
            try {
                const bookingsResponse = await axios.get('/api/bookings/123'); // Replace 123 with actual customer ID
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
            <Navbar />
            {customer ? <CustomerInfo customer={customer} /> : <p>Loading customer info...</p>}
            {bookings.length > 0 ? <BookingList bookings={bookings} /> : <p>Loading bookings...</p>}
        </div>
    );
};

export default ProfilePage;
