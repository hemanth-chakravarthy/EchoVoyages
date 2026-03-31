/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFlag,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaListUl,
  FaRoute,
  FaArrowLeft,
  FaImage,
  FaInfoCircle,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setReviews] = useState([]);
  const [isAgent, setIsAgent] = useState(false);
  const [reportedReviews, setReportedReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "agency") {
          setIsAgent(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/packages/${id}`);
        const data = await response.json();
        if (data && data.image) {
          data.image = data.image.map((img) =>
            img.startsWith("http") ? img : `${apiUrl}${img}`
          );
        }
        setPackageDetails(data);
        if (data.reviewCount > 0) {
          await fetchReviews();
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/reviews/package/${id}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchPackageDetails();
    fetchReviews();
  }, [id]);

  const handleReportReview = async (reviewId) => {
    if (reportedReviews[reviewId]) {
      toast.info("This review has already been reported.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/reviews/${reviewId}`);
      if (response.status === 200) {
        toast.success("Review has been reported successfully!");
        setReportedReviews((prev) => ({ ...prev, [reviewId]: true }));
      } else {
        toast.error("Failed to report the review.");
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error("An error occurred while reporting the review.");
    }
  };

  const addToWishlist = async () => {
    const token = localStorage.getItem("token");
    const customerId = jwtDecode(token).id;
    try {
      const response = await fetch(`${apiUrl}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          packageId: id,
        }),
      });

      if (response.ok) {
        toast.success("Package added to wishlist successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("An error occurred while adding to the wishlist.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black/40">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-20 bg-white border border-black/5">
          <FaInfoCircle className="text-black/20 text-6xl mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 uppercase tracking-tighter">Package Not Found</h2>
          <p className="text-black/40 text-sm mb-8 px-8 uppercase tracking-wider leading-relaxed">
            The package you are looking for does not exist or has been removed from our listings.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:opacity-70 transition-opacity"
          >
            <FaArrowLeft /> Back to Discovery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-12 px-4 md:px-6">
      {/* Header Area */}
      <div className="max-w-6xl mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-black/40 hover:text-[#1a1a1a] transition-colors mb-10"
        >
          <FaArrowLeft /> Back to List
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex-1">
            <span className="block text-xs font-bold tracking-[0.4em] text-black/40 uppercase mb-4">
              001 / Travel Package
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1a1a1a] uppercase">
              {packageDetails.name}
            </h1>
          </div>
          
          <div className="inline-flex items-center gap-4 bg-[#FFC107] px-6 py-3">
            <FaStar className="text-[#1a1a1a]" />
            <span className="font-black text-xl text-[#1a1a1a]">
              {revvs.length > 0
                ? (revvs.reduce((sum, r) => sum + r.rating, 0) / revvs.length).toFixed(1)
                : "0.0"}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-black/60">
              ({revvs.length} Reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Side: Images & Detailed Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Gallery Section */}
            <div className="bg-white border border-black/5 p-4">
              <span className="block text-xs font-bold tracking-[0.2em] text-black/20 uppercase mb-4 pl-2">
                002 / Visual Reference
              </span>
              {packageDetails.image && packageDetails.image.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black/5 overflow-hidden">
                    <img
                      src={packageDetails.image[activeImageIndex]}
                      alt="Current"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {packageDetails.image.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`aspect-square cursor-pointer transition-all duration-300 border-2 ${
                          index === activeImageIndex ? "border-[#1a1a1a]" : "border-transparent opacity-50 gray-scale hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-black/5 flex items-center justify-center flex-col gap-4 text-black/20">
                  <FaImage className="text-4xl" />
                  <span className="text-xs font-bold uppercase tracking-widest">No Imagery Available</span>
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white border border-black/5 p-10">
              <span className="block text-xs font-bold tracking-[0.2em] text-black/20 uppercase mb-6">
                003 / Narrative
              </span>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase tracking-tight">Overview</h2>
              <p className="text-black/60 leading-[1.8] tracking-wide first-letter:text-4xl first-letter:font-black first-letter:mr-1">
                {packageDetails.description}
              </p>
            </div>

            {/* Itinerary Section */}
            <div className="bg-white border border-black/5 p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <FaRoute className="text-9xl" />
               </div>
              <span className="block text-xs font-bold tracking-[0.2em] text-black/20 uppercase mb-6">
                004 / Routing
              </span>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8 uppercase tracking-tight">Daily Itinerary</h2>
              {packageDetails.itinerary ? (
                <div className="space-y-8 border-l-2 border-black/5 pl-8 ml-2">
                  <div className="text-black/70 leading-relaxed whitespace-pre-line text-sm uppercase tracking-wider font-medium font-sans">
                    {packageDetails.itinerary}
                  </div>
                </div>
              ) : (
                <p className="text-black/30 italic text-sm">Detailed routing data not documented.</p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-black/5 p-10">
              <span className="block text-xs font-bold tracking-[0.2em] text-black/20 uppercase mb-8">
                005 / Guest Feedback
              </span>
              
              {revvs && revvs.length > 0 ? (
                <div className="space-y-8">
                  {revvs.map((review, idx) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-l-4 border-[#1a1a1a] pl-8 py-2 relative group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FaStar key={s} className={s <= review.rating ? "text-[#FFC107]" : "text-black/5"} />
                            ))}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] bg-[#1a1a1a]/5 px-2 py-1">
                            {review.customerName || "Anonymous"}
                          </span>
                        </div>
                        {isAgent && (
                          <button
                            onClick={() => handleReportReview(review._id)}
                            className={`p-2 transition-colors ${reportedReviews[review._id] ? "text-red-500 opacity-100" : "text-black/10 hover:text-red-400 opacity-0 group-hover:opacity-100"}`}
                            disabled={reportedReviews[review._id]}
                          >
                            <FaFlag />
                          </button>
                        )}
                      </div>
                      <p className="text-[#1a1a1a]/70 text-sm leading-relaxed font-medium italic">
                        "{review.comment}"
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-black/5">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-black/20">Zero record of reviews</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Information Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              {/* Summary Card */}
              <div className="bg-[#1a1a1a] text-white p-10">
                <span className="block text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-10">
                  Data Summary
                </span>

                <div className="space-y-12">
                  <div className="relative">
                    <span className="absolute -top-3 text-[50px] font-black text-white/5 left-0">01</span>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Economic Valuation</p>
                    <p className="text-4xl font-black tracking-tighter relative z-10">₹{packageDetails.price}</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-3 text-[50px] font-black text-white/5 left-0">02</span>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Temporal Frame</p>
                    <p className="text-2xl font-black tracking-tighter relative z-10 uppercase">{packageDetails.duration} Days</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-3 text-[50px] font-black text-white/5 left-0">03</span>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Geographic Index</p>
                    <p className="text-2xl font-black tracking-tighter relative z-10 uppercase">{packageDetails.location}</p>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 space-y-4">
                  <button className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#FFC107] transition-all hover:tracking-[0.5em]">
                    Initiate Booking
                  </button>
                  <button 
                    onClick={addToWishlist}
                    className="w-full py-5 bg-transparent border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all flex items-center justify-center gap-4"
                  >
                    <FaHeart className="text-xs" /> Save To Wishlist
                  </button>
                </div>
              </div>

              {/* Highlights List */}
              <div className="bg-white border border-black/5 p-10">
                 <span className="block text-xs font-bold tracking-[0.2em] text-black/20 uppercase mb-8">
                  Highlights
                </span>
                <div className="flex items-start gap-4">
                  <FaListUl className="text-[#1a1a1a] mt-1 shrink-0" />
                  <p className="text-sm font-medium text-black/70 leading-relaxed uppercase tracking-wider">
                    {packageDetails.highlights}
                  </p>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default ViewPackage;
