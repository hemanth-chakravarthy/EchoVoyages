/** @format */

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  FaChartPie,
  FaClipboardList,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";
import apiUrl from "../utils/api.js";

gsap.registerPlugin(ScrollTrigger);

const AgentHomePage = () => {
  const [requests, setRequests] = useState([]);
  const [allRevs, setReviews] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [bookingStats, setBookingStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const token = localStorage.getItem("token");
  const agentid = jwtDecode(token).id;
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const requestsRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${apiUrl}/requests/agen/${agentid}`);
        const data = await response.json();
        if (data && data.data) {
          setRequests(data.data);
        } else {
          console.error("No requests found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${apiUrl}/reviews`);
        const data = await response.json();
        if (data) {
          setReviews(data);
        } else {
          console.error("No reviews found.");
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    const fetchOutgoingGuideRequests = async () => {
      setLoadingRequests(true);
      try {
        const response = await axios.get(`${apiUrl}/guide-requests`, {
          params: {
            agencyId: agentid,
            initiator: "agency", // Requests initiated by this agency
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOutgoingRequests(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch outgoing guide requests:", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    const fetchBookingStats = async () => {
      setLoadingStats(true);
      try {
        // Fetch all bookings
        const response = await axios.get(`${apiUrl}/bookings`);

        if (response.data && response.data.data) {
          // Count bookings by status
          const bookings = response.data.data;

          // Initialize counters
          let pending = 0;
          let confirmed = 0;
          let canceled = 0;

          // Count bookings by status
          bookings.forEach((booking) => {
            if (booking.status === "pending") pending++;
            else if (booking.status === "confirmed") confirmed++;
            else if (booking.status === "canceled") canceled++;
          });

          // Create data for pie chart
          const stats = [
            { name: "Pending", value: pending, color: "#FFC107" },
            { name: "Confirmed", value: confirmed, color: "#4CAF50" },
            { name: "Canceled", value: canceled, color: "#F44336" },
          ];

          setBookingStats(stats);
          console.log("Booking stats:", stats);
        }
      } catch (error) {
        console.error("Failed to fetch booking statistics:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchRequests();
    fetchReviews();
    fetchOutgoingGuideRequests();
    fetchBookingStats();
  }, [agentid, token]);

  // GSAP Scroll Animations
  useEffect(() => {
    // Hero fade in
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }

    // Stats cards stagger animation
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Charts section reveal
    if (chartsRef.current) {
      gsap.fromTo(
        chartsRef.current.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: chartsRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Requests section slide up
    if (requestsRef.current) {
      gsap.fromTo(
        requestsRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: requestsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [bookingStats, requests]);

  const handleCancelRequest = async (requestId) => {
    try {
      // Delete the request from the database
      await axios.delete(`${apiUrl}/guide-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the request from the local state
      setOutgoingRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      toast.success("Request cancelled successfully");
    } catch (err) {
      console.error("Error cancelling guide request:", err);
      toast.error("Failed to cancel request");
    }
  };

  return (
    <div className="w-full bg-[#f5f3f0] text-[#1a1a1a] font-sans min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Header Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[40vh] flex flex-col justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-white/70 uppercase mb-4">
            001 / Dashboard
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Agency Command<br/>Center
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed">
            Orchestrate your travel empire. Monitor bookings, manage requests, and deliver exceptional experiences to your clients.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        
        {/* Stats Overview - Scroll Animated */}
        <div ref={statsRef} className="mb-16 md:mb-24">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
            002 / Overview
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 text-[#1a1a1a]">
            Booking Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {bookingStats.map((stat, index) => (
              <div
                key={stat.name}
                className="stat-card group bg-white rounded-none p-8 md:p-10 border-l-4 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{ borderColor: stat.color }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    {stat.name === "Pending" && (
                      <FaRegClock style={{ color: stat.color }} className="text-2xl" />
                    )}
                    {stat.name === "Confirmed" && (
                      <FaCheckCircle style={{ color: stat.color }} className="text-2xl" />
                    )}
                    {stat.name === "Canceled" && (
                      <FaTimesCircle style={{ color: stat.color }} className="text-2xl" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-[0.2em] text-black/50 uppercase mb-3">
                    {stat.name}
                  </p>
                  <h3 className="text-5xl md:text-6xl font-black tracking-tighter" style={{ color: stat.color }}>
                    {stat.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section - Scroll Animated */}
        <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="bg-white p-8 md:p-12 border border-black/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-[#1a1a1a]"></div>
              <div>
                <span className="block text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
                  Analytics
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a]">
                  Distribution
                </h2>
              </div>
            </div>
            {loadingStats ? (
              <div className="flex justify-center items-center h-80">
                <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {bookingStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "0",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                        padding: "16px"
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={50}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent Requests Preview */}
          <div className="bg-[#1a1a1a] text-white p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-white"></div>
              <div>
                <span className="block text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                  Latest Activity
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Recent Requests
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {requests.slice(0, 3).map((req, index) => (
                <motion.div
                  key={req._id}
                  whileHover={{ x: 10 }}
                  className="group pb-6 border-b border-white/10 last:border-0 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg group-hover:text-[#2d2d2d] transition-colors">
                      {req.packageName}
                    </h3>
                    <span className="text-[10px] font-bold tracking-wider text-white/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 uppercase tracking-wider font-semibold">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-white/40" />
                      {req.customerName}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-white/40" />
                      {new Date(req.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Link
                    to={`/requests/${req._id}`}
                    className="inline-flex items-center gap-2 mt-4 text-xs font-bold tracking-wider text-white/70 hover:text-white transition-colors uppercase group"
                  >
                    View Details 
                    <FaArrowRight className="text-[10px] group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Request List - Scroll Animated */}
        <section ref={requestsRef} className="mb-20">
          <div className="mb-12">
            <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
              003 / Management
            </span>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-12 bg-[#1a1a1a]"></div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
                All Booking Requests
              </h2>
            </div>
          </div>

          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {requests.map((req, index) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase">
                        Request #{String(index + 1).padStart(3, '0')}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/10 flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors">
                        <FaEnvelope className="text-[#1a1a1a] group-hover:text-white transition-colors text-sm" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-6 group-hover:text-[#2d2d2d] transition-colors">
                      {req.packageName}
                    </h3>
                    
                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex items-center gap-3 text-black/60">
                        <FaUser className="text-[#1a1a1a] text-xs" />
                        <span className="font-semibold">{req.customerName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-black/60">
                        <FaCalendarAlt className="text-[#1a1a1a] text-xs" />
                        <span className="font-semibold">{new Date(req.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-black/70 text-sm leading-relaxed mt-4 line-clamp-2">
                        {req.message}
                      </p>
                    </div>
                    
                    <Link
                      to={`/requests/${req._id}`}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all group w-full justify-center"
                    >
                      View Details 
                      <FaArrowRight className="text-[10px] group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white border border-black/5">
              <div className="mb-8">
                <FaClipboardList className="text-8xl text-black/10 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-black/30 uppercase tracking-widest mb-4">
                No Requests
              </h3>
              <p className="text-black/40 text-sm tracking-wider">
                No booking requests available at this time
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#111111] text-[#f5f3f0] py-12 uppercase tracking-[0.15em] text-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
            <span className="font-bold">© 2026 Echo Voyages Agency Portal</span>
            <span className="text-[9px] tracking-widest">Powered by Innovation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgentHomePage;
