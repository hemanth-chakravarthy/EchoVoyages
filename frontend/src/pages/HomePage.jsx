/** @format */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiUrl from "../utils/api.js";

const HomePage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${apiUrl}/packages`);
        const data = await response.json();

        if (data && data.data) {
          // Sort by latest as default from previous logic
          const sorted = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setPackages(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter logic based on active status
  const filteredPackages = packages.filter((pack) => pack.isActive);

  return (
    <div className="min-h-screen bg-[#f5f3f0] text-black font-sans pb-12">



      {/* HEADER */}
      <div className="pt-24 sm:pt-28 px-6 sm:px-12 pb-0">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tighter text-black uppercase">
          Destinations
        </h1>
      </div>

      {/* DYNAMIC SUBHEADER */}
      <div className="px-6 sm:px-12 pt-6 pb-6 sm:pt-8 sm:pb-8 md:pt-10 md:pb-10 w-full max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight">
          Discover the best travel destinations in <span className="font-semibold">the World</span>
        </h2>
      </div>

      {/* PACKAGE GRID */}
      <div className="px-6 sm:px-12 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredPackages.map((pack) => (
              <Link
                key={pack._id}
                to={`/packages/${pack._id}`}
                className="relative aspect-[4/3] group overflow-hidden bg-gray-900 block rounded-md shadow-md hover:shadow-xl transition-shadow duration-500"
              >
                {/* Fallback pattern / Loading BG */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black z-0"></div>

                {/* Image */}
                {pack.image && pack.image.length > 0 && (
                  <img
                    src={pack.image[0].startsWith("http") ? pack.image[0] : `${apiUrl}${pack.image[0]}`}
                    alt={pack.name}
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-1000 group-hover:scale-110"
                  />
                )}

                {/* Gradient Overlays for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 z-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-80"></div>

                {/* Top Left: Destination Name */}
                <div className="absolute top-6 left-6 z-30 max-w-[75%]">
                  <h3 className="text-white font-bold text-lg sm:text-xl uppercase tracking-widest drop-shadow-md leading-tight line-clamp-2">
                    {pack.name}
                  </h3>
                </div>

                {/* Bottom Left: Location */}
                <div className="absolute bottom-6 left-6 z-30 max-w-[85%]">
                  <p className="text-white/90 font-bold text-sm sm:text-base tracking-wide drop-shadow-sm line-clamp-1">
                    {pack.location || "Global"}
                  </p>
                </div>

                {/* Top Right: Bookmark Icon */}
                <div className="absolute top-6 right-6 z-30">
                  <button className="text-white/70 hover:text-white transition-colors" onClick={(e) => {
                    e.preventDefault(); // prevents link click if they just want to bookmark
                    // Fake bookmark handler
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="drop-shadow-sm">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 select-none">
            <h3 className="text-2xl font-black uppercase tracking-widest text-[#888]">
              No Destinations Found
            </h3>
            <p className="mt-4 text-[#888] font-medium tracking-wide">
              Try exploring a different category or return home.
            </p>
          </div>
        )}
      </div>

      {/* Spacer for bottom */}
      <div className="h-24"></div>
    </div>
  );
};

export default HomePage;
