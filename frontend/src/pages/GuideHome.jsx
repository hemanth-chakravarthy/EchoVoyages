/** @format */

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiUrl from "../utils/api.js";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaChartBar, FaBox, FaStar, FaUser, FaComments } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const GuideHome = () => {
  const [guideData, setGuide] = useState(null);
  const [reviews, setRevDetails] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const guideId = jwtDecode(localStorage.getItem("token")).id;

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const packagesRef = useRef(null);
  const reviewsRef = useRef(null);

  console.log(bookings);
  useEffect(() => {
    setIsLoading(true);

    const fetchGuideData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/reviews/guides/${guideId}/details`
        );
        setGuide(response.data.guide);
        setRevDetails(response.data.review || []);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/bookings/guides/${guideId}`);
        const bookingData = res.data;

        const pendingBookings = bookingData.filter(
          (booking) => booking.status === "pending"
        ).length;
        const confirmedBookings = bookingData.filter(
          (booking) => booking.status === "confirmed"
        ).length;
        const canceledBookings = bookingData.filter(
          (booking) => booking.status === "cancelled"
        ).length;

        setBookings(bookingData);
        setPendingCount(pendingBookings);
        setConfirmedCount(confirmedBookings);
        setCanceledCount(canceledBookings);
        setTotalCount(bookingData.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchPackageData = async () => {
      try {
        // Fetch packages assigned to this guide from the guide's assignedPackages array
        const response = await axios.get(
          `${apiUrl}/guides/${guideId}/assigned-packages`
        );
        const packagesData = response.data.data || [];
        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    // Execute all fetch functions
    Promise.all([
      fetchGuideData(),
      fetchBookingsData(),
      fetchPackageData(),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [guideId]);

  // GSAP scroll animations
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [totalCount, pendingCount]);

  const bookingData = [
    { name: "Pending", value: pendingCount },
    { name: "Confirmed", value: confirmedCount },
    { name: "Cancelled", value: canceledCount },
  ];

  const COLORS = ["#FFC107", "#4CAF50", "#F44336"];

  return (
    <div className="w-full bg-[#f5f3f0] text-[#1a1a1a] font-sans min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-[#f5f3f0] flex flex-col items-center justify-center z-[100]">
          <div className="text-2xl font-bold mb-4 tracking-tight text-black">EchoVoyages Guide</div>
          <div className="w-64 h-[2px] bg-black/10 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-black w-1/2 animate-pulse" />
          </div>
          <div className="mt-4 text-[10px] text-black/50 uppercase font-bold tracking-widest">
            Loading Dashboard...
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section 
        ref={heroRef}
        className="relative min-h-[40vh] flex flex-col justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-white/70 uppercase mb-4">
            001 / Guide Dashboard
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Your Guide<br/>Command Center
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed">
            Monitor your bookings, manage packages, and track your performance metrics.
          </p>
        </div>
      </section>

      <main className="max-w-[90%] mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Booking Statistics */}
        <div ref={statsRef} className="mb-16 md:mb-24">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
            002 / Statistics
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 text-[#1a1a1a]">
            Booking Overview
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
            {[
              { label: "Total Bookings", value: totalCount, color: "#1a1a1a" },
              { label: "Pending", value: pendingCount, color: "#FFC107" },
              { label: "Confirmed", value: confirmedCount, color: "#4CAF50" },
              { label: "Cancelled", value: canceledCount, color: "#F44336" },
            ].map((stat, index) => (
              <div
                key={index}
                className="stat-card group bg-white p-6 md:p-8 border-l-4 hover:shadow-2xl transition-all duration-500"
                style={{ borderColor: stat.color }}
              >
                <p className="text-xs font-bold tracking-[0.2em] text-black/50 uppercase mb-4">
                  {stat.label}
                </p>
                <h3 
                  className="text-4xl md:text-5xl font-black tracking-tighter group-hover:scale-110 transition-transform"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-8 md:p-12 border border-black/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-[#1a1a1a]"></div>
                <div>
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
                    Bar Chart
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
                    Booking Status
                  </h3>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#1a1a1a" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <YAxis stroke="#1a1a1a" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "0",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                  <Bar dataKey="value" fill="#1a1a1a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1a1a1a] p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-white"></div>
                <div>
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                    Distribution
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Status Breakdown
                  </h3>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#1a365d"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "0",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#fff"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Assigned Packages */}
        <div ref={packagesRef} className="mb-16 md:mb-24">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
            003 / Packages
          </span>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-12 bg-[#1a1a1a]"></div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
              My Assigned Packages
            </h2>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="h-56 overflow-hidden bg-black/5">
                    {pkg.image && pkg.image.length > 0 ? (
                      <img
                        src={
                          pkg.image[0].startsWith("http")
                            ? pkg.image[0]
                            : `${apiUrl}${pkg.image[0]}`
                        }
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox className="text-black/20 text-6xl" />
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <span className="block text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase mb-4">
                      Package #{String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 group-hover:text-[#2d2d2d] transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-black/60 text-sm mb-6 line-clamp-2">
                      {pkg.description}
                    </p>
                    <Link
                      to={`/packages/${pkg._id}`}
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white border border-black/5">
              <FaBox className="text-8xl text-black/10 mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-black/30 uppercase tracking-widest mb-4">
                No Packages
              </h3>
              <p className="text-black/40 text-sm tracking-wider">
                No packages assigned yet.
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div ref={reviewsRef} className="mb-20">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
            004 / Feedback
          </span>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="w-2 h-12 bg-[#1a1a1a]"></div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
                Reviews
              </h2>
            </div>

            <div className="flex items-center bg-white px-8 py-4 border border-black/10">
              <FaStar className="text-[#FFD700] mr-3 text-2xl" />
              <div>
                <span className="block text-3xl font-bold text-[#1a1a1a]">
                  {guideData?.ratings?.averageRating > 0
                    ? guideData.ratings.averageRating.toFixed(1)
                    : "0.0"}
                </span>
                <span className="block text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
                  ({guideData?.ratings?.numberOfReviews || 0} ratings)
                </span>
              </div>
            </div>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 border border-black/5 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[250px]"
                >
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white mr-4 flex-shrink-0">
                        {review.customerImage ? (
                          <img
                            src={review.customerImage}
                            alt={review.customerName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1a1a1a] truncate mb-2">
                          {review.customerName}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`${
                                index < review.rating
                                  ? "text-[#FFD700]"
                                  : "text-black/20"
                              } w-4 h-4`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-black/60 text-sm leading-relaxed line-clamp-4">
                      {review.comment}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white border border-black/5">
              <FaComments className="text-8xl text-black/10 mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-black/30 uppercase tracking-widest mb-4">
                No Reviews
              </h3>
              <p className="text-black/40 text-sm tracking-wider">
                No reviews available yet.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#111111] text-[#f5f3f0] py-12 uppercase tracking-[0.15em] text-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
            <span className="font-bold">© 2026 Echo Voyages Guide Portal</span>
            <span className="text-[9px] tracking-widest">Powered by Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuideHome;
