import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component
import { Link } from 'react-router-dom';

const ViewPendingCustomers = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const guideId = token ? jwtDecode(token).id : null; // Get the logged-in guide's ID

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/bookings/guides/${guideId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings.');
                }

                const data = await response.json();
                setBookings(data); // Set the bookings state
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (guideId) {
            fetchBookings();
        }
    }, [guideId, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Pending Bookings</h1>
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            <h2>{booking.customerName}</h2>
                            <p>Status: {booking.status}</p>
                            <Link to={`/bookings/${booking._id}`}><button>View</button></Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending bookings.</p>
            )}
        </div>
    );
};

export default ViewPendingCustomers;
