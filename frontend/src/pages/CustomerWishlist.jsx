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
                    <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin"></div>
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
                                        <div className="p-6">
                                            <p className="text-[#2d3748]">Package details unavailable.</p>
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
                                        <div className="p-6">
                                            <p className="text-[#2d3748]">Guide details unavailable.</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* No Items Message */}
                {wishlist.packages.length === 0 && wishlist.guides.length === 0 && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-xl text-[#2d3748]"
                    >
                        No items in your wishlist.
                    </motion.p>
                )}
            </motion.main>
        </motion.div>
    );
};

export default CustomerWishlist;
