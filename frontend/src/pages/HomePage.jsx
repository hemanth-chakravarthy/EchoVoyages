import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const HomePage = () => {
    const [packages, setPackages] = useState([]);

    // Fetching packages from the server
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('http://localhost:5000/packages');
                const data = await response.json();

                if (data && data.data) {
                    setPackages(data.data);
                } else {
                    console.error('No packages found in the response.');
                }
            } catch (error) {
                console.error('Failed to fetch packages:', error);
            }
        };

        fetchPackages();
    }, []);

    return (
        <div>
            <h1>Available Packages</h1>
            {packages.length > 0 ? (
                <ul>
                    {packages.map((pack) => (
                        <li key={pack._id}>
                            <h2>{pack.name}</h2>
                            <p>{pack.description}</p>
                            <p>Price: {pack.price}</p>
                            <p>Duration: {pack.duration} days</p>
                            <Link to={`/packages/${pack._id}`}>
                                <button>View Package</button>
                            </Link>
                            {/* Display images */}
                            {pack.image && pack.image.length > 0 ? (
                                <div>
                                    {pack.image.map((img, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000${img}`}  // Assuming image paths are relative to a public folder
                                            alt={`Package ${pack.name}`}
                                            style={{ width: '200px', height: '150px', marginRight: '10px' }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>No images available for this package</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No packages available</p>
            )}
        </div>
    );
};

export default HomePage;
