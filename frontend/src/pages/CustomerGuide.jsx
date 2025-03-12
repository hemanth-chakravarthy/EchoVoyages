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
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-bold text-center mb-16 text-white">Our Guides</h1>
                {guides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => (
                            <div key={guide._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105">
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold text-white mb-2">{guide.username}</h2>
                                    <p className="text-gray-300 mb-4">{guide.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm text-gray-300">Experience: {guide.experience} years</p>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-4">Languages: {guide.languages.join(', ')}</p>
                                    <Link to={`/guides/${guide._id}`} className="block w-full">
                                        <button className="w-full bg-transparent text-transparent font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient">
                                            View Guide
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-xl text-white">No guides available</p>
                )}
            </main>
        </div>
    );
};

export default CustomerGuide;

