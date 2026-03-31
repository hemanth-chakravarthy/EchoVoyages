/** @format */

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import apiUrl from "../utils/api.js";

const AgentViewAll = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("revenue");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingCount = async (packageId) => {
      try {
        const response = await fetch(`${apiUrl}/bookings/pack/${packageId}`);
        if (response.status === 404) return 0;
        if (!response.ok) throw new Error(`Failed to fetch booking count`);
        const bookingCount = await response.json();
        return bookingCount.length;
      } catch (error) {
        return 0;
      }
    };

    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const agentId = decodedToken.id;
        const response = await fetch(`${apiUrl}/packages/agents/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch packages");
        }

        const data = await response.json();
        const packagesWithRevenue = await Promise.all(
          data.map(async (pkg) => {
            const numbookings = await fetchBookingCount(pkg._id);
            return { ...pkg, revenue: pkg.price * numbookings, bookingCount: numbookings };
          })
        );

        setPackages(packagesWithRevenue.sort((a, b) => b.revenue - a.revenue));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...packages];
    switch (value) {
      case "revenue": sorted.sort((a, b) => b.revenue - a.revenue); break;
      case "price": sorted.sort((a, b) => b.price - a.price); break;
      case "duration": sorted.sort((a, b) => b.duration - a.duration); break;
      case "bookings": sorted.sort((a, b) => b.bookingCount - a.bookingCount); break;
    }
    setPackages(sorted);
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPackageImage = (pkg) => {
    if (!pkg.image) return null;
    if (Array.isArray(pkg.image)) {
      if (pkg.image.length === 0) return null;
      const p = pkg.image[0];
      return p.startsWith("/") ? `${apiUrl}${p}` : p;
    }
    if (typeof pkg.image === "string") {
      return pkg.image.startsWith("/") ? `${apiUrl}${pkg.image}` : pkg.image;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#F44336] mb-3">Error</p>
          <p className="text-[#1a1a1a] mb-6 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-black/80 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] font-sans text-[#1a1a1a]">
      {/* Page Header */}
      <div className="pt-24 sm:pt-28 px-6 sm:px-12 pb-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-2">Agency Portal</p>
        <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tighter uppercase mb-8">
          Travel Packages
        </h1>
      </div>

      {/* Controls Bar */}
      <div className="w-full bg-[#1a1a1a] text-white flex flex-wrap items-center justify-between px-6 sm:px-12 py-4 gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 min-w-[240px] flex-1 max-w-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50 shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-white/40 text-[11px] font-bold uppercase tracking-widest focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 focus:outline-none border-none cursor-pointer"
          >
            <option value="revenue" className="bg-[#1a1a1a]">Revenue</option>
            <option value="price" className="bg-[#1a1a1a]">Price</option>
            <option value="duration" className="bg-[#1a1a1a]">Duration</option>
            <option value="bookings" className="bg-[#1a1a1a]">Bookings</option>
          </select>

          {/* Create Button */}
          <Link
            to="/createPackage"
            className="bg-white text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest px-6 py-2 hover:bg-white/90 transition-colors"
          >
            + New Package
          </Link>
        </div>
      </div>

      {/* Subheader */}
      <div className="px-6 sm:px-12 pt-8 pb-6">
        <h2 className="text-3xl sm:text-4xl font-normal leading-tight tracking-tight">
          {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""} listed
        </h2>
      </div>

      {/* Package Grid */}
      <div className="px-6 sm:px-12 pb-16">
        {filteredPackages.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-black/20">
            <p className="text-sm text-black/40 font-medium uppercase tracking-widest mb-6">No packages found</p>
            <Link to="/createPackage" className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-black/80 transition-colors">
              + Create New Package
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredPackages.map((pkg) => {
              const img = getPackageImage(pkg);
              return (
                <div key={pkg._id} className="group bg-white cursor-pointer" onClick={() => navigate(`/packages/${pkg._id}`)}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                    {img ? (
                      <img src={img} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.3">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                        </svg>
                      </div>
                    )}
                    {/* Status badge */}
                    <div className={`absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 ${pkg.isActive ? "bg-white text-[#1a1a1a]" : "bg-[#1a1a1a]/80 text-white"}`}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </div>
                    {/* Price tag */}
                    <div className="absolute bottom-4 right-4 bg-[#1a1a1a] text-white text-xs font-black px-3 py-1.5">
                      ₹{pkg.price?.toLocaleString()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 border-l-2 border-[#1a1a1a]">
                    <h3 className="font-black text-base uppercase tracking-tight leading-tight mb-3 line-clamp-1">{pkg.name}</h3>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-black/50">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{pkg.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-black/50">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{pkg.duration}d</span>
                      </div>
                    </div>

                    <div className="h-px bg-black/10 mb-4" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 mb-0.5">Revenue</p>
                        <p className="font-black text-sm text-[#4CAF50]">₹{pkg.revenue?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 mb-0.5">Bookings</p>
                        <p className="font-black text-sm">{pkg.bookingCount || 0}</p>
                      </div>
                      <button className="text-[10px] font-bold uppercase tracking-widest border border-black/20 px-4 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentViewAll;
