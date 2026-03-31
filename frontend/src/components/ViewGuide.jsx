/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiUrl from "../utils/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewGuide = () => {
  const { id } = useParams();
  const [guideDetails, setGuideDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revvs, setRevDetails] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const token = localStorage.getItem("token");
  const [bookingId, setBookingId] = useState("");
  const [customerBookings, setCustomerBookings] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/guides/${id}`);
        setGuideDetails(response.data);
      } catch (error) {
        console.error("Error fetching guide details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/reviews/guides/${id}/reviews`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const determineUserRole = async () => {
      if (!token || !userId) { setUserRole("guest"); return; }
      try {
        const r = await axios.get(`${apiUrl}/customers/${userId}`);
        if (r.data) { setUserRole("customer"); return; }
      } catch (_) {}
      try {
        const r = await axios.get(`${apiUrl}/agency/${userId}`);
        if (r.data) { setUserRole("agency"); return; }
      } catch (_) {}
      try {
        const r = await axios.get(`${apiUrl}/guides/${userId}`);
        if (r.data) { setUserRole("guide"); return; }
      } catch (_) { setUserRole("guest"); }
    };

    fetchReviews();
    fetchGuideDetails();
    determineUserRole();
  }, [id, userId, token]);

  useEffect(() => {
    if (userId && token && userRole === "customer") {
      axios.get(`${apiUrl}/bookings/cust/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCustomerBookings(res.data.filter(b => b.guideId === id)))
        .catch(console.error);
    }
  }, [id, userId, token, userRole]);

  const handleBooking = async () => {
    if (!userId || userRole !== "customer") { setBookingStatus("You must be logged in as a customer to book a guide."); return; }
    try {
      const res = await axios.post(`${apiUrl}/bookings`, { customerId: userId, guideId: guideDetails._id, packageId: null }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 201) { toast.success("Booking confirmed successfully!"); setBookingStatus("Booking confirmed successfully!"); }
      else { toast.error("Failed to book the guide."); setBookingStatus("Failed to book the guide."); }
    } catch (error) { toast.error("An error occurred while booking."); setBookingStatus("An error occurred while booking."); }
  };

  const handleSubmitReview = async () => {
    if (!userId || userRole !== "customer") { toast.error("You must be logged in as a customer to submit a review."); return; }
    try {
      const res = await fetch(`${apiUrl}/reviews`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ customerId: userId, guideId: id, bookingId, rating, comment }) });
      if (res.ok) { toast.success("Review submitted successfully!"); setShowReviewModal(false); setRating(1); setComment(""); }
      else { const e = await res.json(); toast.error(`Failed to submit review: ${e.message}`); }
    } catch (error) { toast.error("An error occurred while submitting the review."); }
  };

  const handleAddToWishlist = async () => {
    if (!userId || userRole !== "customer") { toast.error("You must be logged in as a customer to add a guide to your wishlist."); return; }
    try {
      const res = await axios.post(`${apiUrl}/wishlistGuides`, { customerId: userId, guideId: guideDetails._id }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 201) toast.success("Guide added to wishlist successfully!");
      else toast.error("Failed to add guide to wishlist.");
    } catch (error) { toast.error(`${error.message}`); }
  };

  if (!guideDetails) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const avgRating = guideDetails.ratings?.averageRating || 0;
  const numReviews = guideDetails.ratings?.numberOfReviews || 0;

  const infoItems = [
    { label: "001/ Experience", value: `${guideDetails.experience} years` },
    { label: "002/ Languages", value: guideDetails.languages?.join(", ") },
    { label: "003/ Phone", value: guideDetails.phno },
    { label: "004/ Email", value: guideDetails.gmail },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3f0] font-sans text-[#1a1a1a]">
      <ToastContainer position="bottom-right" />

      {/* Hero Banner */}
      <div className="relative w-full h-72 bg-[#1a1a1a] overflow-hidden">
        <img src="/images/guide-banner.png" alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col justify-end px-10 pb-8">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Guide Profile</p>
          <h1 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">{guideDetails.username}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.round(avgRating) ? "#fff" : "none"} stroke="white" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-white/70 text-xs font-bold tracking-widest uppercase">{avgRating.toFixed(1)} · {numReviews} {numReviews === 1 ? "review" : "reviews"}</span>
          </div>
        </div>
        {/* Profile Picture */}
        <div className="absolute bottom-0 right-10 translate-y-1/2">
          <div className="w-24 h-24 border-4 border-[#f5f3f0] bg-[#1a1a1a] overflow-hidden">
            {guideDetails.profilePicture
              ? <img src={`${apiUrl}/${guideDetails.profilePicture}`} alt={guideDetails.username} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-20 pb-16">
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {userRole === "customer" && (
            <>
              <button onClick={handleBooking} className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-black/80 transition-colors">
                Book Guide
              </button>
              <button onClick={() => setShowReviewModal(true)} className="border border-black/20 text-[#1a1a1a] text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-black hover:text-white transition-colors">
                Add Review
              </button>
              <button onClick={handleAddToWishlist} className="border border-black/20 text-[#1a1a1a] text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-black hover:text-white transition-colors">
                + Wishlist
              </button>
            </>
          )}
          {userRole === "agency" && (
            <button onClick={() => window.location.href = `/agency-guide-directory`} className="border border-black/20 text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-black hover:text-white transition-colors">
              ← Guide Directory
            </button>
          )}
          {userRole === "guide" && (
            <button onClick={() => window.location.href = `/GuideHome`} className="border border-black/20 text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-black hover:text-white transition-colors">
              ← Dashboard
            </button>
          )}
          {(userRole === "guest" || !userRole) && (
            <button onClick={() => window.location.href = `/login`} className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-black/80 transition-colors">
              Login to Book
            </button>
          )}
        </div>

        {bookingStatus && (
          <div className={`border-l-4 p-4 mb-8 text-sm font-medium ${bookingStatus.includes("successfully") ? "border-[#4CAF50] bg-[#4CAF50]/5 text-[#2e7d32]" : "border-[#F44336] bg-[#F44336]/5 text-[#c62828]"}`}>
            {bookingStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: About + Info */}
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-3">001/ About</p>
              <p className="text-[#1a1a1a]/80 leading-relaxed text-sm">{guideDetails.description}</p>
            </div>

            <div className="h-px bg-black/10" />

            {/* Info Grid */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-5">002/ Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoItems.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#1a1a1a] pl-4 py-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-black/40 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{item.value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-black/10" />

            {/* Reviews */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-5">003/ Reviews</p>
              {revvs && revvs.length > 0 ? (
                <div className="space-y-4">
                  {revvs.map((review) => (
                    <div key={review._id} className="bg-white p-5 border-l-2 border-[#1a1a1a]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < review.rating ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">By {review.customerName || "Anonymous"}</span>
                      </div>
                      <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-black/20">
                  <p className="text-sm text-black/40 font-medium uppercase tracking-widest">No reviews yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Rating Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] text-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Rating</p>
              <div className="text-5xl font-black mb-1">{avgRating.toFixed(1)}</div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(avgRating) ? "white" : "none"} stroke="white" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{numReviews} {numReviews === 1 ? "review" : "reviews"}</p>
            </div>

            <div className="bg-white p-6 border-l-2 border-[#1a1a1a]">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-4">Quick Facts</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Experience</p>
                  <p className="font-black text-xl">{guideDetails.experience}<span className="text-sm font-normal text-black/50"> yrs</span></p>
                </div>
                <div className="h-px bg-black/10" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Languages</p>
                  <p className="text-sm font-semibold">{guideDetails.languages?.length || 0} spoken</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-1">001/ Submit</p>
                <h2 className="text-xl font-black uppercase tracking-tight">Rate & Review</h2>
              </div>
              <button onClick={() => { setShowReviewModal(false); setRating(1); setComment(""); }} className="text-black/40 hover:text-black transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {customerBookings.length > 0 ? (
              <div className="mb-5">
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Select Booking</label>
                <select className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black" onChange={e => setBookingId(e.target.value)}>
                  <option value="">— Choose a booking —</option>
                  {customerBookings.map(b => <option key={b._id} value={b._id}>{b.bookingId || b._id} — {new Date(b.bookingDate).toLocaleDateString()}</option>)}
                </select>
              </div>
            ) : (
              <div className="mb-5 border-l-2 border-[#F44336] pl-3 py-1">
                <p className="text-sm text-[#c62828]">You haven't booked this guide yet.</p>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-3">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setRating(v)} onMouseEnter={() => setHoveredRating(v)} onMouseLeave={() => setHoveredRating(0)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={v <= (hoveredRating || rating) ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="2" className="transition-all">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-black/50">{rating}/5</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Comment</label>
              <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" placeholder="Share your experience..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowReviewModal(false); setRating(1); setComment(""); }} className="flex-1 border border-black/20 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmitReview} disabled={!bookingId && customerBookings.length > 0} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGuide;
