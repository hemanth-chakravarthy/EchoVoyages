import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerWishlist = () => {
    const [wishlist, setWishlist] = useState({ packages: [], guides: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const customerId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        const fetchWishlistData = async () => {
            try {
                const [packageResponse, guideResponse] = await Promise.all([
                    fetch(`http://localhost:5000/wishlist/customer/${customerId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`http://localhost:5000/wishlistGuides/cust/${customerId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                ]);

                if (!packageResponse.ok || !guideResponse.ok) {
                    throw new Error('Failed to fetch wishlist data.');
                }

                const [packageData, guideData] = await Promise.all([
                    packageResponse.json(),
                    guideResponse.json()
                ]);

                setWishlist({
                    packages: Array.isArray(packageData) ? packageData : [packageData],
                    guides: Array.isArray(guideData) ? guideData : [guideData]
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (customerId) {
            fetchWishlistData();
        }
    }, [customerId, token]);

    const handleRemoveItem = async (itemId, type) => {
        try {
            const endpoint = type === 'package' ? `http://localhost:5000/wishlist/${itemId}` : `http://localhost:5000/wishlistGuides/${itemId}`;
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                const updateWishlist = type === 'package' ? 
                    { ...wishlist, packages: wishlist.packages.filter(item => item._id !== itemId) } :
                    { ...wishlist, guides: wishlist.guides.filter(item => item._id !== itemId) };

                setWishlist(updateWishlist);
                toast.success(data.message);
            } else {
                toast.error(data.message || `Failed to remove ${type} from wishlist`);
            }
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
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
            <ToastContainer position="top-right" autoClose={3000} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-bold text-center mb-16 text-white">My Wishlist</h1>

                {/* Packages Section */}
                {wishlist.packages.length > 0 ? (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-white">Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.packages.map((item) => (
                                <div key={item._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105">
                                    {item.packageId ? (
                                        <div className="p-6 bg-gray-800 rounded-b-xl">
                                        <h3 className="text-2xl font-semibold text-white mb-2">{item.packageId.name}</h3>
                                        <p className="text-gray-300 mb-4">{item.packageId.description}</p>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-lg font-bold text-white">${item.packageId.price}</p>
                                            <p className="text-sm text-gray-300">{item.packageId.duration} days</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item._id, 'package')}
                                            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    ) : (
                                        <div className="p-6">
                                            <p className="text-white">Package details unavailable.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-xl text-white">No packages in your wishlist.</p>
                )}

                {/* Guides Section */}
                {wishlist.guides.length > 0 ? (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-white">Guides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.guides.map((item) => (
                                <div key={item._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105">
                                    {item.guideId ? (
                                        <div className="p-6">
                                            <h3 className="text-2xl font-semibold text-white mb-2">{item.guideId.name}</h3>
                                            <p className="text-gray-300 mb-4">{item.guideId.description}</p>
                                            <p className="text-sm text-gray-300 mb-4">Experience: {item.guideId.experience} years</p>
                                            <button
                                                onClick={() => handleRemoveItem(item._id, 'guide')}
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
                ) : (
                    <p className="text-center text-xl text-white">No guides in your wishlist.</p>
                )}

                {/* No Items Message */}
                {wishlist.packages.length === 0 && wishlist.guides.length === 0 && (
                    <p className="text-center text-xl text-white">No items in your wishlist.</p>
                )}
            </main>
        </div>
    );
};

export default CustomerWishlist;
