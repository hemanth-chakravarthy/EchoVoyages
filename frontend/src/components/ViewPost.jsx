import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewPost = () => {
    const { id } = useParams(); // Get the package ID from the URL
    const [packageDetails, setPackageDetails] = useState(null);

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
        </div>
    );
};

export default ViewPost;
