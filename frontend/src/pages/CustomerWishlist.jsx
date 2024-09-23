// CustomerWishlist.jsx
import React, { useEffect, useState } from 'react';

const CustomerWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Assume customer ID is retrieved from some user context or token
    const customerId = localStorage.getItem('customerId');  // Replace with actual logic to fetch logged-in user's ID

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/wishlist/${customerId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch wishlist.');
                }
                const data = await response.json();
                setWishlist(data.packages || []); // Set packages in wishlist if available
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [customerId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>My Wishlist</h1>
            {wishlist.length > 0 ? (
                <ul>
                    {wishlist.map((pkg) => (
                        <li key={pkg._id}>
                            <h2>{pkg.name}</h2>
                            <p>{pkg.description}</p>
                            <p>Price: {pkg.price}</p>
                            <p>Duration: {pkg.duration} days</p>
                            {/* If you want to show package images */}
                            {pkg.image && pkg.image.length > 0 ? (
                                <img 
                                    src={`http://localhost:5000${pkg.image[0]}`}  // Assuming image paths are correct
                                    alt={pkg.name}
                                    style={{ width: '200px', height: '150px' }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in your wishlist.</p>
            )}
        </div>
    );
};

export default CustomerWishlist;
