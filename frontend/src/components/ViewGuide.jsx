import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode correctly
import axios from 'axios';

const ViewGuide = () => {
    const { id } = useParams(); // Get the guide ID from the URL
    const [guideDetails, setGuideDetails] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(''); // For displaying booking status
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Decode the token to get the customerId
    const customerId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/guides/${id}`);
                setGuideDetails(response.data);
            } catch (error) {
                console.error('Error fetching guide details:', error);
            }
        };

        fetchGuideDetails();
    }, [id]);

    // Function to handle booking submission
    const handleBooking = async () => {
        try {
            if (!customerId) {
                setBookingStatus('Customer is not authenticated. Please log in.');
                return;
            }
    
            // Assuming you have packageId from somewhere (e.g., a selected package)
            const packageId = null; // Change this as per your actual packageId source
    
            const bookingData = {
                customerId,   // Use decoded customer ID from token
                guideId: guideDetails._id, // Use guide ID
                packageId: packageId || null,  // Optional packageId
            };
    
            const response = await axios.post('http://localhost:5000/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in headers if required
                },
            });
    
            if (response.status === 201) { // 201 for successful creation
                setBookingStatus('Booking confirmed successfully!');
            } else {
                setBookingStatus('Failed to book the guide.');
            }
        } catch (error) {
            console.error('Error during booking:', error);
            setBookingStatus('An error occurred while booking.');
        }
    };
    

    if (!guideDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className="guide-details">
            <h1>{guideDetails.name}</h1>
            <p>{guideDetails.description}</p>
            <p>Experience: {guideDetails.experience} years</p>
            <p>Languages: {guideDetails.languages.join(', ')}</p>

            {/* Display booking section */}
            <div className="booking-section">
                <h2>Book this guide</h2>
                <button onClick={handleBooking}>Book Guide</button>
                {bookingStatus && <p>{bookingStatus}</p>}
            </div>
        </div>
    );
};

export default ViewGuide;
