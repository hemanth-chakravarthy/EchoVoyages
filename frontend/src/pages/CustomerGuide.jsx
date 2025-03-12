import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const CustomerGuide = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch('http://localhost:5000/guides');
                const data = await response.json();

                if (data && data.data) {
                    setGuides(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch guides:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

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
                    Our Guides
                </motion.h1>

                {guides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => (
                            <motion.div
                                key={guide._id}
                                whileHover={{ 
                                    y: -5, 
                                    scale: 1.01,
                                    boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                                }}
                                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-[#1a365d] mb-2">{guide.username}</h2>
                                    <p className="text-[#2d3748] mb-4 leading-relaxed">{guide.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-[#2d3748]">
                                            <span className="font-semibold">Experience:</span> {guide.experience} years
                                        </p>
                                    </div>
                                    <p className="text-[#2d3748] mb-4">
                                        <span className="font-semibold">Languages:</span> {guide.languages.join(', ')}
                                    </p>
                                    <Link to={`/guides/${guide._id}`} className="block w-full">
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: "#1a365d" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            View Guide
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-xl text-[#2d3748]"
                    >
                        No guides available
                    </motion.p>
                )}
            </motion.main>
        </motion.div>
    );
};

export default CustomerGuide;

