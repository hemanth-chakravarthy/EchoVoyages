import React, { useState, useEffect } from 'react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Loader state
    const [error, setError] = useState(null); // Error handling

    useEffect(() => {
        // Function to fetch bookings data from the backend
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings'); // Replace with your backend API route
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                // Check if 'bookings' array exists, otherwise use data directly
                setBookings(data.bookings || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div>Loading bookings...</div>; // You can replace this with a spinner/loader component
    }

    if (error) {
        return <div>Error loading bookings: {error}</div>;
    }

    return (
        <div className="booking-list">
            <h2>Previous Bookings</h2>
            <div className="bookings-grid">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className="booking">
                            <h3>Package: {booking.packageName || 'N/A'}</h3>
                            <p><strong>Guide Name:</strong> {booking.guideName || 'N/A'}</p>
                            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No previous bookings available.</p>
                )}
            </div>
        </div>
    );
};

export default BookingList;
