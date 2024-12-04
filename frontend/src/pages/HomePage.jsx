import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching packages from the server
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/packages");
        const data = await response.json();

        if (data && data.data) {
          setPackages(data.data);
        } else {
          console.error("No packages found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-white">Explore Our Packages</h1>
        {loading ? (
          <p className="text-center text-xl text-gray-300">Loading packages...</p>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pack) =>
              pack.isActive ? (
                <div
                  key={pack._id}
                  className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-opacity-20"
                >
                  {/* Image Container */}
                  <div className="h-64 w-full">
                    {pack.image && pack.image.length > 0 ? (
                      <img
                        src={`http://localhost:5000${pack.image[0]}`} // Show the first image
                        alt={`Package ${pack.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-white mb-2">{pack.name}</h2>
                    <p className="text-gray-300 mb-4 truncate">{pack.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-bold text-white">${pack.price}</p>
                      <p className="text-sm text-gray-300">{pack.duration} days</p>
                    </div>
                    <Link to={`/packages/${pack._id}`} className="block">
                      <button className="w-full text-white font-bold py-3 px-6 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300">
                        View Package
                      </button>
                    </Link>
                  </div>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-300">No packages available</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
