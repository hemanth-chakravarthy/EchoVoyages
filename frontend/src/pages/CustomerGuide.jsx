/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaUser, FaLanguage, FaBriefcase, FaEye } from "react-icons/fa";
import apiUrl from "../utils/api.js";

const CustomerGuide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch(`${apiUrl}/guides`);
        const data = await response.json();
        if (data && data.data) {
          setGuides(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-[#38434f] font-medium">Loading guides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] font-['Source Sans', 'Segoe UI', Arial, sans-serif] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#38434f] mb-6">Our Guides</h1>

          {guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <motion.div
                  key={guide._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-[#dce6f1]"
                >
                  <div className="h-40 bg-[#dce6f1] relative overflow-hidden">
                    {guide.profilePicture ? (
                      <img
                        src={`${apiUrl}/${guide.profilePicture}`}
                        alt={guide.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaUser className="text-[#56687a] text-4xl" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-bold text-[#38434f]">
                        {guide.username}
                      </h2>
                      <div className="flex items-center bg-[#e9e5df] px-2 py-1 rounded-full">
                        <FaStar className="text-[#e7a33e] mr-1" />
                        <span className="text-[#38434f] font-medium">
                          {guide.ratings && guide.ratings.averageRating > 0
                            ? guide.ratings.averageRating.toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-[#56687a] text-xs ml-1">
                          ({guide.ratings ? guide.ratings.numberOfReviews : 0}{" "}
                          {guide.ratings && guide.ratings.numberOfReviews === 1
                            ? "rating"
                            : "ratings"}
                          )
                        </span>
                      </div>
                    </div>

                    <p className="text-[#56687a] mb-4 line-clamp-3">
                      {guide.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-[#56687a]">
                        <FaBriefcase className="mr-2 text-[#0a66c2]" />
                        <span>Experience: {guide.experience} years</span>
                      </div>
                      <div className="flex items-center text-[#56687a]">
                        <FaLanguage className="mr-2 text-[#0a66c2]" />
                        <span>Languages: {guide.languages.join(", ")}</span>
                      </div>
                    </div>

                    <Link
                      to={`/guides/${guide._id}`}
                      className="w-full bg-[#f3f6f8] hover:bg-[#dce6f1] text-[#0a66c2] font-medium py-2 rounded flex items-center justify-center transition-colors"
                    >
                      <FaEye className="mr-2" /> View Guide
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-[#f3f6f8] rounded-lg p-8 text-center">
              <FaUser className="text-[#56687a] text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#38434f] mb-2">
                No guides available
              </h3>
              <p className="text-[#56687a]">
                Check back later for available guides.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerGuide;
