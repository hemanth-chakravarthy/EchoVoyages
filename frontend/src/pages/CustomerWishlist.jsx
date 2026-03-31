/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBookmark,
  FaMapMarkedAlt,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTrashAlt,
  FaExclamationCircle,
  FaHeart,
  FaCompass,
  FaLanguage,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

const CustomerWishlist = () => {
  const [wishlist, setWishlist] = useState({ packages: [], guides: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const customerId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        let packages = [];
        try {
          const packageResponse = await fetch(
            `${apiUrl}/wishlist/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (packageResponse.ok) {
            const packageData = await packageResponse.json();
            packages = Array.isArray(packageData) ? packageData : [packageData];
          }
        } catch (packageError) {
          console.error("Error fetching package wishlist:", packageError);
        }

        let guides = [];
        try {
          const guideResponse = await fetch(
            `${apiUrl}/wishlistGuides/cust/${customerId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (guideResponse.ok) {
            const guideData = await guideResponse.json();
            guides = Array.isArray(guideData) ? guideData : [guideData];
          }
        } catch (guideError) {
          console.error("Error fetching guide wishlist:", guideError);
        }

        setWishlist({
          packages: packages,
          guides: guides,
        });
        setLoading(false);
      } catch (error) {
        console.error("General error in fetchWishlistData:", error);
        setError(error.message);
        setLoading(false);
        setWishlist({
          packages: [],
          guides: [],
        });
      }
    };

    if (customerId) {
      fetchWishlistData();
    }
  }, [customerId, token]);

  const handleRemoveItem = async (itemId, type) => {
    try {
      const endpoint =
        type === "package"
          ? `${apiUrl}/wishlist/${itemId}`
          : `${apiUrl}/wishlistGuides/${itemId}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        const updateWishlist =
          type === "package"
            ? {
                ...wishlist,
                packages: wishlist.packages.filter(
                  (item) => item._id !== itemId
                ),
              }
            : {
                ...wishlist,
                guides: wishlist.guides.filter((item) => item._id !== itemId),
              };

        setWishlist(updateWishlist);
        toast.success(data.message);
      } else {
        toast.error(data.message || `Failed to remove ${type} from wishlist`);
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-[2px] bg-[#111111]/20 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-[#111111] animate-pulse" style={{ width: "50%" }} />
          </div>
          <p className="mt-4 text-[10px] text-[#111111]/50 uppercase font-bold tracking-widest">
            Loading Wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen flex items-center justify-center p-6">
        <div className="border border-red-500/30 p-8 md:p-16 text-center max-w-md">
          <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
            Something Went Wrong
          </h2>
          <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-6">
            We could not load your wishlist. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#111111] text-[#f5f3f0] px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f3f0] text-[#111111] min-h-screen font-sans uppercase tracking-[0.15em] text-xs">
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-xs md:text-sm font-semibold tracking-widest text-[#111111]/70 uppercase mb-4">
            010 / Wishlist
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#111111]">
            My Wishlist
          </h1>
          <p className="text-[10px] sm:text-xs md:text-lg text-[#111111]/70 max-w-lg leading-relaxed tracking-wider">
            Items you have saved for future reference. Browse your curated
            collection of packages and guides.
          </p>
        </div>

        {/* Packages Section */}
        {wishlist.packages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaMapMarkedAlt className="text-[#111111]/40 text-lg" />
                <h2 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
                  Travel Packages
                </h2>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-[#111111]/50 uppercase">
                {wishlist.packages.length} SAVED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {wishlist.packages.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="group border border-[#111111]/10 bg-[#ffffff] hover:border-[#111111]/30 transition-all duration-500"
                >
                  {item.packageId ? (
                    <div className="p-6 md:p-8">
                      {/* Image */}
                      <div className="mb-6 overflow-hidden">
                        {item.packageId.image && item.packageId.image.length > 0 ? (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            src={
                              item.packageId.image[0].startsWith("http")
                                ? item.packageId.image[0]
                                : `${apiUrl}${item.packageId.image[0]}`
                            }
                            alt={item.packageId.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-[#f0eeeb] flex items-center justify-center">
                            <FaMapMarkedAlt className="text-[#111111]/10 text-4xl" />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111] mb-4">
                        {item.packageId.name}
                      </h3>

                      {/* Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <FaMoneyBillWave className="text-[#111111]/30 text-xs" />
                          <p className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                            ₹{item.packageId.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="text-[#111111]/30 text-xs" />
                          <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                            {item.packageId.duration} DAYS
                          </p>
                        </div>

                        {item.packageId.location && (
                          <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-[#111111]/30 text-xs" />
                            <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                              {item.packageId.location}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item._id, "package")}
                        className="w-full border border-red-500/30 text-red-600 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt className="text-xs" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 md:p-8">
                      <div className="bg-red-500/5 p-6 mb-6 flex items-center gap-3 border border-red-500/10">
                        <FaExclamationCircle className="text-red-500 text-xl" />
                        <div>
                          <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-1">
                            Package Unavailable
                          </h3>
                          <p className="text-[10px] text-red-500/70 uppercase tracking-widest">
                            This package has been removed or is no longer available.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id, "package")}
                        className="w-full border border-red-500/30 text-red-600 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt className="text-xs" /> Remove from Wishlist
                      </button>
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
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaUserTie className="text-[#111111]/40 text-lg" />
                <h2 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
                  Travel Guides
                </h2>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-[#111111]/50 uppercase">
                {wishlist.guides.length} SAVED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {wishlist.guides.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="group border border-[#111111]/10 bg-[#ffffff] hover:border-[#111111]/30 transition-all duration-500"
                >
                  {item.guideId ? (
                    <div className="p-6 md:p-8">
                      {/* Avatar & Name */}
                      <div className="flex items-center mb-6">
                        <div className="h-16 w-16 border border-[#111111]/20 flex items-center justify-center text-[#111111] text-xl font-bold mr-4 overflow-hidden shrink-0">
                          {item.guideId.profilePicture ? (
                            <img
                              src={`${apiUrl}/${item.guideId.profilePicture}`}
                              alt={item.guideId.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaUserTie className="text-[#111111]/20 text-2xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold tracking-tight text-[#111111]">
                            {item.guideId.name}
                          </h3>
                          {item.guideId.location && (
                            <p className="text-[10px] text-[#111111]/50 uppercase tracking-widest mt-1">
                              {item.guideId.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <FaBriefcase className="text-[#111111]/30 text-xs" />
                          <p className="text-[10px] font-bold text-[#111111] uppercase tracking-widest">
                            {item.guideId.experience || 0} YEARS EXPERIENCE
                          </p>
                        </div>

                        {item.guideId.languages && (
                          <div className="flex items-start gap-3">
                            <FaLanguage className="text-[#111111]/30 text-xs mt-1" />
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(item.guideId.languages)
                                ? item.guideId.languages
                                : [item.guideId.languages]
                              ).map((lang, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 border border-[#111111]/20 text-[10px] font-bold uppercase tracking-widest text-[#111111]/70"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item._id, "guide")}
                        className="w-full border border-red-500/30 text-red-600 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt className="text-xs" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 md:p-8">
                      <div className="bg-red-500/5 p-6 mb-6 flex items-center gap-3 border border-red-500/10">
                        <FaExclamationCircle className="text-red-500 text-xl" />
                        <div>
                          <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-1">
                            Guide Unavailable
                          </h3>
                          <p className="text-[10px] text-red-500/70 uppercase tracking-widest">
                            This guide has been removed or is no longer available.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id, "guide")}
                        className="w-full border border-red-500/30 text-red-600 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt className="text-xs" /> Remove from Wishlist
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {wishlist.packages.length === 0 && wishlist.guides.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#111111]/10 p-8 md:p-16 text-center"
          >
            <FaHeart className="w-16 h-16 text-[#111111]/10 mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111] mb-3">
              Your Wishlist Is Empty
            </h3>
            <p className="text-[10px] text-[#111111]/40 uppercase tracking-widest mb-8 max-w-md mx-auto">
              Explore packages and guides to add items to your wishlist for
              future reference.
            </p>
            <Link
              to="/home"
              className="inline-flex items-center bg-[#111111] text-[#f5f3f0] px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 gap-2"
            >
              <FaCompass className="text-xs" /> Explore Packages
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CustomerWishlist;
