import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from '../components/Navbar';


const CustomerGuide = () => {
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch('http://localhost:5000/guides');
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
                            <h2>{guide.username}</h2>
                            <p>{guide.description}</p>
                            <p>Experience: {guide.experience} years</p>
                            <p>Languages: {guide.languages.join(', ')}</p>
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
