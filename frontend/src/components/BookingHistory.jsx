import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingHistory = ({ customerId }) => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const response = await axios.get(`/api/bookings?customerId=${customerId}`);
                setBookingHistory(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking history:", error);
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, [customerId]);

    if (loading) {
        return <div>Loading booking history...</div>;
    }

    if (bookingHistory.length === 0) {
        return <div>No bookings found</div>;
    }

    return (
        <div className="booking-history">
            <h2>Your Booking History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Booking Date</th>
                        <th>Package/Guide Name</th>
                        <th>Total Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookingHistory.map((booking) => (
                        <tr key={booking._id}>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>
                                {/* Show whether it's a guide booking, package booking, or both */}
                                {booking.guideId && booking.packageId ? 'Guide & Package' : booking.guideId ? 'Guide' : 'Package'}
                            </td>
                            <td>
                                {/* Show package name if available, otherwise guide name */}
                                {booking.packageId && booking.packageId.packageName ? (
                                    <span>Package: {booking.packageId.packageName}</span>
                                ) : null}
                                {booking.guideId && booking.guideId.name ? (
                                    <span>Guide: {booking.guideId.name}</span>
                                ) : null}
                            </td>
                            <td>${booking.totalPrice}</td>
                            <td>{booking.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingHistory;
