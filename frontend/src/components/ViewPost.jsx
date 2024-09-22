import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ViewPost = () => {
    const { id } = useParams(); // Get the package ID from the URL
    const [packageDetails, setPackageDetails] = useState(null);
    const customerId = jwtDecode(localStorage.getItem('token')).id;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/packages/${id}`);
                const data = await response.json();
                setPackageDetails(data);
            } catch (error) {
                console.error('Error fetching package details:', error);
            }
        };

        fetchPackageDetails();
    }, [id]);
    const handleBooking = async () => {
        console.log(customerId);
        if (!customerId) {
            alert("Please log in to book the package.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Include token for authentication
                },
                body: JSON.stringify({
                    customerId,    // Logged-in user's customerId
                    packageId: id, // Current package ID from URL params
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Booking details:', result);
                navigate('/home')
            } else {
                const errorData = await response.json();
                console.error('Failed to book the package:', errorData.message);
                alert(`Failed to book the package: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error booking package:', error);
            alert('An error occurred while booking the package.');
        }
    };
    const confirmBooking = () => {
        // Show a confirmation dialog to the user
        const isConfirmed = window.confirm('Do you want to confirm the booking?');
        if (isConfirmed) {
            handleBooking();  // Proceed with booking if the user confirms
        }
    };


    if (!packageDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{packageDetails.name}</h1>
            <p>{packageDetails.description}</p>
            <p>Price: {packageDetails.price}</p>
            <p>Duration: {packageDetails.duration} days</p>
            <p>Location: {packageDetails.location}</p>
            <p>Highlights: {packageDetails.highlights}</p>

            {/* Display images */}
            {packageDetails.image && packageDetails.image.length > 0 ? (
                <div>
                    {packageDetails.image.map((img, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000${img}`}
                            alt={`Image of ${packageDetails.name}`}
                            style={{ width: '300px', height: '200px', marginRight: '10px' }}
                        />
                    ))}
                </div>
            ) : (
                <p>No images available for this package</p>
            )}
            <button onClick={confirmBooking}>Book</button>
        </div>
    );
};

export default ViewPost;
