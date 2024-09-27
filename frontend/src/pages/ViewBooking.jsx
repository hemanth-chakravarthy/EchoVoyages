import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../styles/ViewBooking.css"

const ViewBooking = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
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
                setBooking(data);
                setStatus(data.status);
                
                const customerResponse = await fetch(`http://localhost:5000/customers/${data.customerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!customerResponse.ok) {
                    throw new Error('Failed to fetch customer details.');
                }

                const customerData = await customerResponse.json();
                setCustomer(customerData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, token]);

    const updateStatus = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status.');
            }

            const updatedBooking = await response.json();
            setBooking(updatedBooking);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        updateStatus(newStatus);
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
            {customer && (
                <>
                    <p className="booking-info">Customer Phone: {customer.phno}</p>
                    <p className="booking-info">Customer Email: {customer.gmail}</p>
                </>
            )}
            <label htmlFor="status" className="status-label">Update Status: </label>
            <select
                id="status"
                className="status-dropdown"
                value={status}
                onChange={handleStatusChange}
            >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
    );
};

export default ViewBooking;
