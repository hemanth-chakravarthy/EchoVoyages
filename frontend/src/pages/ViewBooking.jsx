import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/ViewBooking.css"


const ViewBooking = () => {
    const { bookingId } = useParams(); // Get the booking ID from the URL
    const [booking, setBooking] = useState(null); // State to hold booking details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state
    const [status, setStatus] = useState(''); // State to track the selected status
    const token = localStorage.getItem('token'); // Get token from local storage

    useEffect(() => {
        console.log('Booking ID:', bookingId); // Check what bookingId is

        const fetchBooking = async () => {
            try {
                const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch booking.');
                }

                const data = await response.json();
                setBooking(data); // Set the fetched booking data
                setStatus(data.status); // Initialize status with the current booking status
                setLoading(false);
            } catch (error) {
                setError(error.message); // Set error message
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, token]);

    // Function to update booking status
    const updateStatus = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }), // Send updated status
            });

            if (!response.ok) {
                throw new Error('Failed to update status.');
            }

            const updatedBooking = await response.json();
            setBooking(updatedBooking); // Update the booking with new status
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle dropdown change
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus); // Update local state immediately
        updateStatus(newStatus); // Send the updated status to the backend
    };

    if (loading) {
        return <div className="loading-message">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!booking || !booking.guideId) {
        return <div className="error-message">No booking found or this booking is not associated with a guide.</div>;
    }

    return (
        <div className="booking-container">
            <h1 className="booking-title">Booking Details</h1>
            <h2 className="booking-id">Booking ID: {booking._id}</h2>
            <p className="booking-info">Customer Name: {booking.customerName}</p>
            <p className="booking-info">Status: {booking.status}</p>

            {/* Dropdown for updating status */}
            <label htmlFor="status" className="status-label">Update Status: </label>
            <select
                id="status"
                className="status-dropdown"
                value={status} // Set the current value to the state variable
                onChange={handleStatusChange} // Handle status change
            >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
            </select>

            {/* Add more fields as necessary */}
        </div>
    );
};

export default ViewBooking;
