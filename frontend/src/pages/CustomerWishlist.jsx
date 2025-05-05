/** @format */

import { useEffect, useState } from "react";
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
  FaSpinner,
  FaCompass,
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
        // Fetch package wishlist data
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
          // Continue with empty packages array
        }

        // Fetch guide wishlist data
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
          // Continue with empty guides array
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

        // Set empty arrays for both to prevent UI issues
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif]"
      >
        <div className="flex-grow flex items-center justify-center flex-col">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <FaSpinner className="w-8 h-8 text-[#0a66c2] animate-spin" />
              <p className="text-[#38434f] font-medium">
                Loading your wishlist...
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif]"
      >
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
            <FaExclamationCircle className="w-16 h-16 text-[#b24020] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#38434f] mb-2">
              Something went wrong
            </h2>
            <p className="text-[#56687a] mb-6">
              We could not load your wishlist. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors"
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
      className="min-h-screen flex flex-col bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif]"
    >
      {/* Navbar removed - now using RoleBasedNavbar from Layout component */}
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.main
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-6 relative z-10"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center mb-2">
            <FaBookmark className="text-[#0a66c2] mr-2 text-xl" />
            <h1 className="text-2xl font-bold text-[#38434f]">My Wishlist</h1>
          </div>
          <p className="text-[#56687a]">
            Items you have saved for future reference
          </p>
        </div>

        {/* Packages Section */}
        {wishlist.packages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaMapMarkedAlt className="text-[#0a66c2] mr-2" />
                  <h2 className="text-lg font-bold text-[#38434f]">
                    Travel Packages
                  </h2>
                </div>
                <span className="bg-[#dce6f1] text-[#0a66c2] px-2 py-1 rounded-full text-sm font-medium">
                  {wishlist.packages.length} saved
                </span>
              </div>

              <div className="space-y-4">
                {wishlist.packages.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ backgroundColor: "#f3f6f8" }}
                    className="border border-[#dce6f1] rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300"
                  >
                    {item.packageId ? (
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4 h-32 md:h-auto rounded-lg overflow-hidden mb-3 md:mb-0 md:mr-4 flex-shrink-0 border border-[#dce6f1]">
                            {item.packageId.image &&
                            item.packageId.image.length > 0 ? (
                              <img
                                src={
                                  item.packageId.image[0].startsWith("http")
                                    ? item.packageId.image[0]
                                    : `${apiUrl}${item.packageId.image[0]}`
                                }
                                alt={item.packageId.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#dce6f1] flex items-center justify-center">
                                <FaMapMarkedAlt className="text-[#56687a] text-2xl" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#38434f] mb-2">
                              {item.packageId.name}
                            </h3>
                            <p className="text-[#56687a] mb-3 text-sm line-clamp-2">
                              {item.packageId.description}
                            </p>
                            <div className="flex flex-wrap gap-4 mb-3">
                              <div className="flex items-center text-[#56687a]">
                                <FaMoneyBillWave className="mr-1 text-[#0a66c2]" />
                                <span className="font-medium">
                                  ₹{item.packageId.price.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center text-[#56687a]">
                                <FaCalendarAlt className="mr-1 text-[#0a66c2]" />
                                <span>{item.packageId.duration} days</span>
                              </div>
                              {item.packageId.location && (
                                <div className="flex items-center text-[#56687a]">
                                  <FaMapMarkedAlt className="mr-1 text-[#0a66c2]" />
                                  <span>{item.packageId.location}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  handleRemoveItem(item._id, "package")
                                }
                                className="flex items-center text-[#b24020] hover:text-[#dc2626] transition-colors"
                              >
                                <FaTrashAlt className="mr-1" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#f9f5f2]">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4 h-32 md:h-auto rounded-lg overflow-hidden mb-3 md:mb-0 md:mr-4 flex-shrink-0 bg-[#f3e9e5] flex items-center justify-center">
                            <FaExclamationCircle className="text-[#b24020] text-2xl" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <FaExclamationCircle className="text-[#b24020] mr-2" />
                              <h3 className="text-lg font-medium text-[#b24020]">
                                Package Unavailable
                              </h3>
                            </div>
                            <p className="text-[#b24020] text-sm mb-3">
                              This package has been removed or is no longer
                              available.
                            </p>
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  handleRemoveItem(item._id, "package")
                                }
                                className="flex items-center text-[#b24020] hover:text-[#dc2626] transition-colors"
                              >
                                <FaTrashAlt className="mr-1" /> Remove from
                                Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Guides Section */}
        {wishlist.guides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaUserTie className="text-[#0a66c2] mr-2" />
                  <h2 className="text-lg font-bold text-[#38434f]">
                    Travel Guides
                  </h2>
                </div>
                <span className="bg-[#dce6f1] text-[#0a66c2] px-2 py-1 rounded-full text-sm font-medium">
                  {wishlist.guides.length} saved
                </span>
              </div>

              <div className="space-y-4">
                {wishlist.guides.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ backgroundColor: "#f3f6f8" }}
                    className="border border-[#dce6f1] rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300"
                  >
                    {item.guideId ? (
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-[#dce6f1]">
                            {item.guideId.profilePicture ? (
                              <img
                                src={`${apiUrl}/${item.guideId.profilePicture}`}
                                alt={item.guideId.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#dce6f1] flex items-center justify-center">
                                <FaUserTie className="text-[#56687a]" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#38434f] mb-1">
                              {item.guideId.name}
                            </h3>
                            <p className="text-[#56687a] mb-3 text-sm line-clamp-2">
                              {item.guideId.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-[#dce6f1] text-[#0a66c2] px-2 py-1 rounded-full text-xs font-medium">
                                {item.guideId.experience} years experience
                              </span>
                              {item.guideId.languages && (
                                <span className="bg-[#dce6f1] text-[#0a66c2] px-2 py-1 rounded-full text-xs font-medium">
                                  {Array.isArray(item.guideId.languages)
                                    ? item.guideId.languages.join(", ")
                                    : item.guideId.languages}
                                </span>
                              )}
                              {item.guideId.location && (
                                <span className="bg-[#dce6f1] text-[#0a66c2] px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                  <FaMapMarkedAlt className="mr-1 text-xs" />{" "}
                                  {item.guideId.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleRemoveItem(item._id, "guide")}
                            className="flex items-center text-[#b24020] hover:text-[#dc2626] transition-colors"
                          >
                            <FaTrashAlt className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#f9f5f2]">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-[#f3e9e5] flex items-center justify-center">
                            <FaExclamationCircle className="text-[#b24020]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <FaExclamationCircle className="text-[#b24020] mr-2" />
                              <h3 className="text-lg font-medium text-[#b24020]">
                                Guide Unavailable
                              </h3>
                            </div>
                            <p className="text-[#b24020] text-sm mb-3">
                              This guide has been removed or is no longer
                              available.
                            </p>
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  handleRemoveItem(item._id, "guide")
                                }
                                className="flex items-center text-[#b24020] hover:text-[#dc2626] transition-colors"
                              >
                                <FaTrashAlt className="mr-1" /> Remove from
                                Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* No Items Message */}
        {wishlist.packages.length === 0 && wishlist.guides.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <FaHeart className="w-16 h-16 mx-auto mb-4 text-[#dce6f1]" />
            <h3 className="text-xl font-bold text-[#38434f] mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-[#56687a] mb-6 max-w-md mx-auto">
              Explore packages and guides to add items to your wishlist for
              future reference.
            </p>
            <a
              href="/home"
              className="inline-flex items-center bg-[#0a66c2] text-white px-4 py-2 rounded hover:bg-[#004182] transition-colors"
            >
              <FaCompass className="mr-2" /> Explore Packages
            </a>
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  );
};

export default CustomerWishlist;
