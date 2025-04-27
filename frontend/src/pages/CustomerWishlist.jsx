import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import { motion } from "framer-motion";
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
                // Fetch package wishlist data
                let packages = [];
                try {
                    const packageResponse = await fetch(`http://localhost:5000/wishlist/customer/${customerId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (packageResponse.ok) {
                        const packageData = await packageResponse.json();
                        packages = Array.isArray(packageData) ? packageData : [packageData];
                    }
                } catch (packageError) {
                    console.error("Error fetching package wishlist:", packageError);
                    // Continue with empty packages array
                }

                // Fetch guide wishlist data
                let guides = [];
                try {
                    const guideResponse = await fetch(`http://localhost:5000/wishlistGuides/cust/${customerId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (guideResponse.ok) {
                        const guideData = await guideResponse.json();
                        guides = Array.isArray(guideData) ? guideData : [guideData];
                    }
                } catch (guideError) {
                    console.error("Error fetching guide wishlist:", guideError);
                    // Continue with empty guides array
                }

                setWishlist({
                    packages: packages,
                    guides: guides
                });
                setLoading(false);
            } catch (error) {
                console.error("General error in fetchWishlistData:", error);
                setError(error.message);
                setLoading(false);

                // Set empty arrays for both to prevent UI issues
                setWishlist({
                    packages: [],
                    guides: []
                });
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex flex-col bg-white"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0',
                    backgroundColor: 'rgba(255, 255, 255, 0.97)'
                }}
            >
                <Navbar />
                <div className="flex-grow flex items-center justify-center flex-col">
                    <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-[#1a365d] text-xl font-medium">Loading your wishlist...</p>
                </div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex flex-col bg-white"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0',
                    backgroundColor: 'rgba(255, 255, 255, 0.97)'
                }}
            >
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 max-w-md text-center">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-[#1a365d] mb-2">Something went wrong</h2>
                        <p className="text-[#2d3748] mb-6">We couldn't load your wishlist. Please try again later.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col bg-white"
            style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0',
                backgroundColor: 'rgba(255, 255, 255, 0.97)'
            }}
        >
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <motion.main
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="flex-grow container mx-auto px-4 py-12 relative z-10"
            >
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-5xl font-bold text-[#1a365d] tracking-tight text-center mb-16"
                >
                    My Wishlist
                </motion.h1>

                {/* Packages Section */}
                {wishlist.packages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.packages.map((item) => (
                                <motion.div
                                    key={item._id}
                                    whileHover={{
                                        y: -5,
                                        scale: 1.01,
                                        boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                                    }}
                                    className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    {item.packageId ? (
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold text-[#1a365d] mb-2">{item.packageId.name}</h3>
                                            <p className="text-[#2d3748] mb-4 leading-relaxed">{item.packageId.description}</p>
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="text-2xl font-bold text-[#1a365d]">₹{item.packageId.price}</p>
                                                <p className="text-[#2d3748]">{item.packageId.duration} days</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRemoveItem(item._id, 'package')}
                                                className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-red-50">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <h3 className="text-xl font-bold text-red-700">Package Unavailable</h3>
                                            </div>
                                            <p className="text-red-600 mb-4">This package has been removed or is no longer available.</p>
                                            <motion.button
                                                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRemoveItem(item._id, 'package')}
                                                className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Remove from Wishlist
                                            </motion.button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Guides Section */}
                {wishlist.guides.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">Guides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.guides.map((item) => (
                                <motion.div
                                    key={item._id}
                                    whileHover={{
                                        y: -5,
                                        scale: 1.01,
                                        boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                                    }}
                                    className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    {item.guideId ? (
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold text-[#1a365d] mb-2">{item.guideId.name}</h3>
                                            <p className="text-[#2d3748] mb-4 leading-relaxed">{item.guideId.description}</p>
                                            <p className="text-[#2d3748] mb-4">Experience: {item.guideId.experience} years</p>
                                            <motion.button
                                                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRemoveItem(item._id, 'guide')}
                                                className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-red-50">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <h3 className="text-xl font-bold text-red-700">Guide Unavailable</h3>
                                            </div>
                                            <p className="text-red-600 mb-4">This guide has been removed or is no longer available.</p>
                                            <motion.button
                                                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRemoveItem(item._id, 'guide')}
                                                className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Remove from Wishlist
                                            </motion.button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* No Items Message */}
                {wishlist.packages.length === 0 && wishlist.guides.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center p-12 bg-white rounded-lg shadow-md border border-gray-100"
                    >
                        <svg
                            className="w-24 h-24 mx-auto mb-6 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                        </svg>
                        <h3 className="text-2xl font-bold text-[#1a365d] mb-2">Your wishlist is empty</h3>
                        <p className="text-[#2d3748] mb-6">
                            Explore packages and guides to add items to your wishlist.
                        </p>
                        <a
                            href="/home"
                            className="inline-block bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
                        >
                            Explore Packages
                        </a>
                    </motion.div>
                )}
            </motion.main>
        </motion.div>
    );
};

export default CustomerWishlist;
