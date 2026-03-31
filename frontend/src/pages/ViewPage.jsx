/** @format */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFlag, FaStar, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import apiUrl from "../utils/api.js";

const ViewPage = () => {
  const { id: packageId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const [revvs, setReviews] = useState([]);
  const [reportedReviews, setReportedReviews] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("book");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(1);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [customerBookings, setCustomerBookings] = useState([]);
  const [customDetails, setCustomDetails] = useState({ price: 0, duration: 0, itinerary: "", availableDates: [], maxGroupSize: 1 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPackage, setEditedPackage] = useState({ name: "", price: "", description: "", isActive: "pending" });

  const [showGuideRequestModal, setShowGuideRequestModal] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [guideRequests, setGuideRequests] = useState([]);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const determineUserRole = async () => {
      if (!token) { setRole("guest"); setLoading(false); return; }
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded.userType || decoded.role;
        if (userRole) {
          if (userRole === "customer") setRole("customer");
          else if (userRole === "guide") setRole("guide");
          else if (userRole === "agency" || userRole === "agent") setRole("agency");
          else setRole("guest");
        } else {
          await fetchUserRoleFromAPI(decoded.id);
        }
      } catch (error) { setRole("guest"); }
      finally { setLoading(false); }
    };

    const fetchUserRoleFromAPI = async (userId) => {
      if (!userId) { setRole("guest"); return; }
      try {
        try { const r = await axios.get(`${apiUrl}/customers/${userId}`); if (r.data) { setRole("customer"); return; } } catch (_) {}
        try { const r = await axios.get(`${apiUrl}/guides/${userId}`); if (r.data) { setRole("guide"); return; } } catch (_) {}
        try { const r = await axios.get(`${apiUrl}/agency/${userId}`); if (r.data) { setRole("agency"); return; } } catch (_) {}
        setRole("guest");
      } finally { setLoading(false); }
    };

    determineUserRole();
  }, [token]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/packages/${packageId}`);
        const data = response.data;
        if (data && data.image) data.image = data.image.map(img => img.startsWith("http") ? img : `${apiUrl}${img}`);
        setPackageDetails(data);
        setEditedPackage({ name: data.name || "", price: data.price || "", description: data.description || "", isActive: data.isActive || "pending" });
        setCustomDetails({ price: data.price || 0, duration: data.duration || 0, itinerary: data.itinerary || "", availableDates: data.availableDates || [], maxGroupSize: data.maxGroupSize || 1 });
        const res = await fetch(`${apiUrl}/reviews/package/${packageId}`);
        setReviews(await res.json());
      } catch (error) { console.error("Error fetching package details:", error); }
      finally { setLoading(false); }
    };
    fetchPackageDetails();
  }, [packageId, refreshTrigger]);

  useEffect(() => {
    if (role === "customer" && userId && showReviewModal) {
      axios.get(`${apiUrl}/bookings/cust/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCustomerBookings(res.data.filter(b => b.packageId === packageId)))
        .catch(console.error);
    }
  }, [role, userId, packageId, showReviewModal, token]);

  useEffect(() => {
    if (role === "guide" && userId) {
      axios.get(`${apiUrl}/guide-requests`, { params: { guideId: userId, packageId, type: "package_assignment", initiator: "guide" }, headers: { Authorization: `Bearer ${token}` } })
        .then(res => { if (res.data.data?.length > 0) setExistingRequest(res.data.data[0]); })
        .catch(console.error);
    }
  }, [role, userId, packageId, packageDetails, token]);

  useEffect(() => {
    if (role === "agency" && packageId) {
      axios.get(`${apiUrl}/guide-requests`, { params: { packageId, agencyId: userId, type: "package_assignment", initiator: "guide" }, headers: { Authorization: `Bearer ${token}` } })
        .then(res => setGuideRequests(res.data.data || []))
        .catch(console.error);
    }
  }, [role, packageId, userId, token, refreshTrigger]);

  const handleCustomerRequestSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/requests`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ customerId: userId, packageId, requestType, ...customDetails, message }) });
      if (response.ok) { toast.success(`Request submitted successfully as ${requestType}.`); setShowRequestModal(false); navigate("/home"); }
      else { const e = await response.json(); toast.error(`Failed to submit request: ${e.message}`); }
    } catch (error) { toast.error("An error occurred while submitting the request."); }
  };

  const handleSubmitReview = async () => {
    if (!bookingId) { toast.error("Please select a booking."); return; }
    try {
      const response = await fetch(`${apiUrl}/reviews`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ customerId: userId, packageId, rating, comment, bookingId }) });
      if (response.ok) { toast.success("Review submitted successfully!"); setShowReviewModal(false); setRating(1); setComment(""); setBookingId(""); setRefreshTrigger(p => p + 1); }
      else { const e = await response.json(); toast.error(`Failed to submit review: ${e.message}`); }
    } catch (error) { toast.error("An error occurred while submitting the review."); }
  };

  const addToWishlist = async () => {
    try {
      const response = await fetch(`${apiUrl}/wishlist`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ customerId: userId, packageId }) });
      if (response.ok) toast.success("Package added to wishlist successfully!");
      else { const e = await response.json(); toast.error(`Failed to add to wishlist: ${e.message}`); }
    } catch (error) { toast.error("An error occurred while adding to the wishlist."); }
  };

  const handleUpdatePackage = async () => {
    try {
      const response = await axios.put(`${apiUrl}/packages/${packageId}`, { name: editedPackage.name, price: editedPackage.price, description: editedPackage.description, isActive: editedPackage.isActive });
      toast.success(response.data.message || "Package updated successfully");
      setShowEditModal(false);
      setRefreshTrigger(p => p + 1);
    } catch (error) { toast.error("Error updating the package"); }
  };

  const handleDeletePackage = async () => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        const response = await axios.delete(`${apiUrl}/packages/${packageId}`);
        toast.success(response.data.message || "Package deleted successfully");
        navigate("/packages");
      } catch (error) { toast.error("Error deleting the package"); }
    }
  };

  const handleSendGuideRequest = async () => {
    if (!userId || !packageId) { toast.error("Authentication required"); return; }
    try {
      const response = await axios.post(`${apiUrl}/guide-requests/guide-to-package`, { guideId: userId, packageId, message: message || "I am interested in guiding this package" }, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (response.status === 201) { toast.success("Request sent successfully!"); setShowGuideRequestModal(false); setExistingRequest(response.data.data); }
    } catch (error) { toast.error(error.response?.data?.message || "Failed to send request"); }
  };

  const handleCancelGuideRequest = async () => {
    if (!existingRequest?._id) { toast.error("No request to cancel"); return; }
    try {
      await axios.delete(`${apiUrl}/guide-requests/${existingRequest._id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Request cancelled successfully");
      setExistingRequest(null);
    } catch (error) { toast.error("Failed to cancel request"); }
  };

  const handleGuideRequestStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.put(`${apiUrl}/guide-requests/${requestId}`, { status: newStatus }, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      setGuideRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: newStatus } : r));
      toast.success(`Request ${newStatus} successfully`);
      setRefreshTrigger(p => p + 1);
    } catch (err) { toast.error(`Failed to ${newStatus} request`); }
  };

  const handleReportReview = async (reviewId) => {
    if (reportedReviews[reviewId]) { toast.info("This review has already been reported."); return; }
    try {
      const response = await axios.post(`${apiUrl}/reviews/${reviewId}`);
      if (response.status === 200) { toast.success("Review reported successfully!"); setReportedReviews(prev => ({ ...prev, [reviewId]: true })); }
      else toast.error("Failed to report the review.");
    } catch (error) { toast.error("An error occurred while reporting the review."); }
  };

  // — Loading / Error states —
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#F44336] mb-3">404</p>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Package Not Found</h2>
          <p className="text-black/50 text-sm mb-8">The package you're looking for doesn't exist or has been removed.</p>
          <Link to="/home" className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-black/80 transition-colors">
            ← Browse Packages
          </Link>
        </div>
      </div>
    );
  }

  // Average rating
  const avgRating = revvs.length > 0 ? revvs.reduce((s, r) => s + r.rating, 0) / revvs.length : 0;

  // Status color helper
  const statusBadge = (status) => {
    const map = { approved: "border-[#4CAF50] text-[#2e7d32]", pending: "border-[#FFC107] text-[#f57f17]", rejected: "border-[#F44336] text-[#c62828]" };
    return map[status] || "border-black/20 text-black/50";
  };

  return (
    <div className="min-h-screen bg-[#f5f3f0] font-sans text-[#1a1a1a]">
      <ToastContainer position="bottom-right" />

      {/* Hero Image */}
      {packageDetails.image && packageDetails.image.length > 0 && (
        <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-[#1a1a1a]">
          <img
            src={packageDetails.image[activeImageIndex]}
            alt={packageDetails.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500"
          />
          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col justify-end px-10 pb-8">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              {packageDetails.location}
            </p>
            <h1 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
              {packageDetails.name}
            </h1>
          </div>
          {/* Thumbnail strip */}
          {packageDetails.image.length > 1 && (
            <div className="absolute bottom-4 right-6 flex gap-2">
              {packageDetails.image.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-12 h-8 overflow-hidden border-2 transition-all ${i === activeImageIndex ? "border-white" : "border-white/30 opacity-50"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
        {/* Back Link */}
        <Link to="/home" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors mb-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ─── LEFT COLUMN ───────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Package Name (if no hero image) */}
            {(!packageDetails.image || packageDetails.image.length === 0) && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-2">{packageDetails.location}</p>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">{packageDetails.name}</h1>
              </div>
            )}

            {/* 001 / Key Info */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-5">001/ Key Info</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Price", value: `₹${packageDetails.price?.toLocaleString()}` },
                  { label: "Duration", value: `${packageDetails.duration} days` },
                  { label: "Location", value: packageDetails.location },
                  { label: "Status", value: packageDetails.isActive ? "Active" : "Inactive" },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[#1a1a1a] pl-4 py-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-black/40 mb-1">{item.label}</p>
                    <p className="text-sm font-black text-[#1a1a1a]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-black/10" />

            {/* 002 / About */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-4">002/ About This Package</p>
              <p className="text-[#1a1a1a]/70 leading-relaxed text-sm">{packageDetails.description}</p>
            </div>

            <div className="h-px bg-black/10" />

            {/* 003 / Itinerary */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-4">003/ Itinerary</p>
              {packageDetails.itinerary ? (
                <div className="text-[#1a1a1a]/70 text-sm leading-relaxed whitespace-pre-line">{packageDetails.itinerary}</div>
              ) : (
                <p className="text-sm text-black/30 italic">Detailed itinerary not available.</p>
              )}
            </div>

            {/* 004 / Guide Requests (Agency only) */}
            {role === "agency" && (
              <>
                <div className="h-px bg-black/10" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-5">004/ Guide Requests</p>
                  {guideRequests.length > 0 ? (
                    <div className="space-y-4">
                      {guideRequests.map((req) => (
                        <div key={req._id} className="bg-white p-5 border-l-2 border-[#1a1a1a]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-black text-sm uppercase tracking-tight">{req.guideName || "Unknown Guide"}</p>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 mt-0.5 mb-2">
                                {new Date(req.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-black/60 leading-relaxed">{req.message}</p>
                            </div>
                            {req.status === "pending" ? (
                              <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleGuideRequestStatusUpdate(req._id, "approved")} className="bg-[#4CAF50] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-2 hover:bg-[#388e3c] transition-colors">
                                  Approve
                                </button>
                                <button onClick={() => handleGuideRequestStatusUpdate(req._id, "rejected")} className="bg-[#F44336] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-2 hover:bg-[#c62828] transition-colors">
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 ${statusBadge(req.status)}`}>
                                {req.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border border-dashed border-black/20">
                      <p className="text-sm text-black/30 font-medium uppercase tracking-widest">No guide requests yet</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="h-px bg-black/10" />

            {/* 005 / Reviews */}
            <div>
              <div className="flex items-baseline gap-4 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">005/ Reviews</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(avgRating) ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-black/50">{avgRating.toFixed(1)} ({revvs.length})</span>
                </div>
              </div>

              {revvs.length > 0 ? (
                <div className="space-y-4">
                  {revvs.map((review) => (
                    <div key={review._id} className="bg-white p-5 border-l-2 border-[#1a1a1a]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex gap-0.5 mb-1">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= review.rating ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            ))}
                          </div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-black/40">By {review.customerName || "Anonymous"}</p>
                        </div>
                        {role === "agency" && (
                          <button onClick={() => handleReportReview(review._id)} disabled={reportedReviews[review._id]} className="text-[9px] font-bold uppercase tracking-widest text-black/30 hover:text-[#F44336] transition-colors disabled:opacity-30">
                            Report
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-black/20">
                  <p className="text-sm text-black/30 font-medium uppercase tracking-widest">No reviews yet</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT SIDEBAR ─────────── */}
          <div className="space-y-6 lg:sticky lg:top-6 self-start">
            {/* Price Card */}
            <div className="bg-[#1a1a1a] text-white p-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2">Price per person</p>
              <div className="text-4xl font-black mb-1">₹{packageDetails.price?.toLocaleString()}</div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{packageDetails.duration} days · {packageDetails.location}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {role === "customer" && (
                <>
                  <button onClick={() => setShowRequestModal(true)} className="w-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-black/80 transition-colors">
                    Customize / Book
                  </button>
                  <button onClick={() => setShowReviewModal(true)} className="w-full border border-black/20 text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                    Add Review
                  </button>
                  <button onClick={addToWishlist} className="w-full border border-black/20 text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                    + Wishlist
                  </button>
                </>
              )}
              {role === "agency" && (
                <>
                  <button onClick={() => setShowEditModal(true)} className="w-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-black/80 transition-colors">
                    Edit Package
                  </button>
                  <button onClick={handleDeletePackage} className="w-full border border-[#F44336]/40 text-[#F44336] text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-[#F44336] hover:text-white transition-colors">
                    Delete Package
                  </button>
                </>
              )}
              {role === "guide" && (
                existingRequest ? (
                  <div className={`p-4 border-l-2 ${statusBadge(existingRequest.status)}`}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-1">Request Status</p>
                    <p className="font-black text-sm uppercase">{existingRequest.status}</p>
                    {existingRequest.status === "pending" && (
                      <button onClick={handleCancelGuideRequest} className="mt-3 w-full border border-current text-[9px] font-bold uppercase tracking-widest py-2 hover:bg-current hover:text-white transition-colors">
                        Cancel Request
                      </button>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setShowGuideRequestModal(true)} className="w-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-black/80 transition-colors">
                    Request to Agency
                  </button>
                )
              )}
              {role === "guest" && (
                <Link to="/login" className="block w-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest py-4 text-center hover:bg-black/80 transition-colors">
                  Login to Book
                </Link>
              )}
            </div>

            {/* Highlights */}
            {packageDetails.highlights && (
              <div className="bg-white p-5 border-l-2 border-[#1a1a1a]">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-3">Highlights</p>
                <p className="text-sm text-[#1a1a1a]/70 leading-relaxed">{packageDetails.highlights}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Customer Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-1">001/ Submit</p>
                <h2 className="text-xl font-black uppercase tracking-tight">Customize / Book</h2>
              </div>
              <button onClick={() => setShowRequestModal(false)} className="text-black/40 hover:text-black transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Request Type</label>
                <select value={requestType} onChange={e => setRequestType(e.target.value)} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black">
                  <option value="book">Book</option>
                  <option value="customize">Customize</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Price (₹)</label>
                <input type="number" value={customDetails.price} onChange={e => setCustomDetails(p => ({ ...p, price: e.target.value }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Duration (days)</label>
                <input type="number" value={customDetails.duration} onChange={e => setCustomDetails(p => ({ ...p, duration: parseInt(e.target.value, 10) }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Itinerary</label>
                <textarea rows={3} value={customDetails.itinerary} onChange={e => setCustomDetails(p => ({ ...p, itinerary: e.target.value }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Select Date</label>
                <DatePicker selected={selectedDate} onChange={date => { setSelectedDate(date); setCustomDetails(p => ({ ...p, availableDates: [date] })); }} minDate={new Date()} dateFormat="MMMM d, yyyy" placeholderText="Click to select a date" className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Max Group Size</label>
                <input type="number" value={customDetails.maxGroupSize} onChange={e => setCustomDetails(p => ({ ...p, maxGroupSize: parseInt(e.target.value, 10) }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Message</label>
                <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Any special requests..." className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRequestModal(false)} className="flex-1 border border-black/20 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Cancel</button>
              <button onClick={handleCustomerRequestSubmit} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-1">001/ Submit</p>
                <h2 className="text-xl font-black uppercase tracking-tight">Rate & Review</h2>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-black/40 hover:text-black transition-colors">
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
                <p className="text-sm text-[#c62828]">You haven't booked this package yet.</p>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-3">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setRating(v)} onMouseEnter={() => setHoveredRating(v)} onMouseLeave={() => setHoveredRating(0)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={v <= (hoveredRating || rating) ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="2" className="transition-all">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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
              <button onClick={() => setShowReviewModal(false)} className="flex-1 border border-black/20 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Cancel</button>
              <button onClick={handleSubmitReview} disabled={!bookingId && customerBookings.length > 0} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal (Agency) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-1">Agency</p>
                <h2 className="text-xl font-black uppercase tracking-tight">Update Package</h2>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-black/40 hover:text-black transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Name</label>
                <input type="text" value={editedPackage.name} onChange={e => setEditedPackage(p => ({ ...p, name: e.target.value }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Price (₹)</label>
                <input type="number" value={editedPackage.price} onChange={e => setEditedPackage(p => ({ ...p, price: e.target.value }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Description</label>
                <textarea rows={4} value={editedPackage.description} onChange={e => setEditedPackage(p => ({ ...p, description: e.target.value }))} className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(false)} className="flex-1 border border-black/20 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Cancel</button>
              <button onClick={handleUpdatePackage} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Request Modal */}
      {showGuideRequestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mb-1">Guide</p>
                <h2 className="text-xl font-black uppercase tracking-tight">Request to Agency</h2>
              </div>
              <button onClick={() => setShowGuideRequestModal(false)} className="text-black/40 hover:text-black transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-black/50 mb-2">Message to Agency</label>
              <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Explain why you're interested in guiding this package..." className="w-full border border-black/20 bg-[#f5f3f0] px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowGuideRequestModal(false)} className="flex-1 border border-black/20 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Cancel</button>
              <button onClick={handleSendGuideRequest} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
