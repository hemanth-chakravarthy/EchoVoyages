import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Navbar from '../components/Navbar';


const CustomerGuide = () => {
    const [guides, setGuides] = useState([]);

    // Fetching guides from the server
    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch('http://localhost:5000/guides'); // Replace with your actual API endpoint
                const data = await response.json();

                if (data && data.data) {
                    setGuides(data.data);
                } else {
                    console.error('No guides found in the response.');
                }
            } catch (error) {
                console.error('Failed to fetch guides:', error);
            }
        };

        fetchGuides();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Our Guides</h1>
            {guides.length > 0 ? (
                <ul>
                    {guides.map((guide) => (
                        <li key={guide._id}>
                            <h2>{guide.name}</h2>
                            <p>{guide.description}</p>
                            <p>Experience: {guide.experience} years</p>
                            <p>Languages: {guide.languages.join(', ')}</p>
                            {guide.image ? (
                                <img
                                    src={`http://localhost:5000${guide.image}`} // Replace with your actual image path
                                    alt={`Guide ${guide.name}`}
                                    style={{ width: '200px', height: '150px', marginRight: '10px' }}
                                />
                            ) : (
                                <p>No image available for this guide</p>
                            )}
                            {/* Add View Guide button */}
                            <Link to={`/guides/${guide._id}`}>
                                <button>View Guide</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No guides available</p>
            )}
        </div>
    );
};

export default CustomerGuide;
