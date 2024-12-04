import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const CustomerWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [guideWishlist, setGuideWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const customerId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/wishlist/customer/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch wishlist.');
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setWishlist(data);
                } else if (data && typeof data === 'object') {
                    setWishlist([data]); 
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchGuideWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/wishlistGuides/cust/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch guide wishlist.');
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setGuideWishlist(data);
                } else if (data && typeof data === 'object') {
                    setGuideWishlist([data]); 
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (customerId) {
            fetchWishlist();
            fetchGuideWishlist();
        }
    }, [customerId, token]);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/wishlist/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setWishlist((prevWishlist) => prevWishlist.filter(item => item._id !== itemId));
                alert(data.message);
            } else {
                alert(data.message || 'Failed to remove item from wishlist');
            }
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    const handleRemoveGuide = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/wishlistGuides/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setGuideWishlist((prevGuideWishlist) => prevGuideWishlist.filter(item => item._id !== itemId));
                alert(data.message);
            } else {
                alert(data.message || 'Failed to remove guide from wishlist');
            }
        } catch (error) {
            console.error('Error removing guide from wishlist:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-white text-2xl">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-bold text-center mb-16 text-white">My Wishlist</h1>

                {/* Packages Section */}
                {wishlist.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-white">Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.map((item) => (
                                <div key={item._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105">
                                    {item.packageId ? (
                                        <>
                                            <div className="relative pb-2/3">
                                                {item.packageId.image && item.packageId.image.length > 0 ? (
                                                    <img
                                                        src={`http://localhost:5000${item.packageId.image[0]}`}
                                                        alt={item.packageId.name}
                                                        className="absolute h-64 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                                        <p className="text-gray-500">No image available</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-2xl font-semibold text-white mb-2">{item.packageId.name}</h3>
                                                <p className="text-gray-300 mb-4">{item.packageId.description}</p>
                                                <div className="flex justify-between items-center mb-4">
                                                    <p className="text-lg font-bold text-white">${item.packageId.price}</p>
                                                    <p className="text-sm text-gray-300">{item.packageId.duration} days</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-6">
                                            <p className="text-white">Package details unavailable.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Guides Section */}
                {guideWishlist.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-white">Guides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {guideWishlist.map((item) => (
                                <div key={item._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105">
                                    {item.guideId ? (
                                        <div className="p-6">
                                            <h3 className="text-2xl font-semibold text-white mb-2">{item.guideId.name}</h3>
                                            <p className="text-gray-300 mb-4">{item.guideId.description}</p>
                                            <p className="text-sm text-gray-300 mb-4">Experience: {item.guideId.experience} years</p>
                                            <button 
                                                onClick={() => handleRemoveGuide(item._id)}
                                                className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <p className="text-white">Guide details unavailable.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {wishlist.length === 0 && guideWishlist.length === 0 && (
                    <p className="text-center text-xl text-white">No items in your wishlist.</p>
                )}
            </main>
        </div>
    );
};

export default CustomerWishlist;

