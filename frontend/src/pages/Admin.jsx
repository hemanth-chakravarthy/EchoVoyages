/** @format */

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import UsersTable from "../components/UserTable";
import PackagesTable from "../components/PackagesTable";
import ReviewsTable from "../components/ReviewsTable";
import GuidesTable from "../components/GuideTable";
import BookingsTable from "../components/BookingsTable";
import AgenciesTable from '../components/AgenciesTable'
import apiUrl from "../utils/api.js";
import {
  UserDistributionChart,
  BookingStatusChart,
  BookingTrendsChart,
  UserTrendsChart,
} from "../components/dashboard";
import DashboardStats from "../components/dashboard/DashboardStats";

gsap.registerPlugin(ScrollTrigger);

const Admin = () => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState("dashboard");
  const [data, setData] = useState({
    customers: [],
    packages: [],
    reviews: [],
    guides: [],
    bookings: [],
    agencies: [],
  });
  
  const heroRef = useRef(null);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchAllData();
    
    // Hero animation
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

    // Sidebar animation
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out"
        }
      );
    }
  }, []);

  const fetchAllData = async () => {
    try {
      const endpoints = [
        "customers",
        "packages",
        "reviews",
        "guides",
        "bookings",
        "agency",
      ];
      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          axios.get(`${apiUrl}/admin/${endpoint}`).catch((error) => {
            console.error(`Error fetching ${endpoint}:`, error);
            return { data: { data: [] } };
          })
        )
      );

      const newData = {};
      endpoints.forEach((endpoint, index) => {
        const responseData = responses[index]?.data?.data || [];
        console.log(`Fetched ${endpoint} data:`, responseData);
        newData[endpoint === "agency" ? "agencies" : endpoint] = responseData;
      });

      setData(newData);
      console.log("Updated dashboard data:", newData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({
        customers: [],
        packages: [],
        reviews: [],
        guides: [],
        bookings: [],
        agencies: [],
      });
    }
  };

  const handleEntityChange = (newEntity) => {
    setEntity(newEntity);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <DashboardStats data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserDistributionChart
          data={{
            customers: data.customers,
            guides: data.guides,
            agencies: data.agencies,
          }}
        />
        <BookingStatusChart data={data} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <BookingTrendsChart data={data} />
        <UserTrendsChart
          data={{
            customers: data.customers,
            guides: data.guides,
            agencies: data.agencies,
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#f5f3f0] text-[#1a1a1a] font-sans min-h-screen pt-16">
      {/* Hero Header */}
      <section 
        ref={heroRef}
        className="relative min-h-[40vh] flex flex-col justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-white/70 uppercase mb-4">
            001 / Admin Portal
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Admin Dashboard
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed">
            Manage all aspects of EchoVoyages from one central command center.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[98%] mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div ref={sidebarRef} className="lg:w-56 flex-shrink-0 space-y-2">
            <span className="block text-xs font-bold tracking-[0.2em] text-black/50 uppercase mb-4">
              Navigation
            </span>
            <button
              onClick={() => handleEntityChange("dashboard")}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                entity === "dashboard"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-black/5 border border-black/5"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleEntityChange("customers")}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                entity === "customers"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-black/5 border border-black/5"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => handleEntityChange("packages")}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                entity === "packages"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-black/5 border border-black/5"
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => handleEntityChange("reviews")}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                entity === "reviews"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-black/5 border border-black/5"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => handleEntityChange("guides")}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                entity === "guides"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-black/5 border border-black/5"
              }`}
            >
              Guides
            </button>
            <button
              onClick={() => handleEntityChange("bookings")}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                entity === "bookings"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] hover:bg-black/5 border border-black/5"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all mt-6"
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div ref={contentRef} className="flex-1 bg-white border border-black/5 overflow-hidden">
            <div className="p-8 md:p-12">
              {entity === "dashboard" ? (
                renderDashboard()
              ) : entity === "customers" ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#1a1a1a]">Users</h2>
                  <div className="w-full overflow-x-auto">
                    <UsersTable users={data.customers} />
                  </div>
                </div>
              ) : entity === "packages" ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#1a1a1a]">Packages</h2>
                  <div className="w-full overflow-x-auto">
                    <PackagesTable packages={data.packages} />
                  </div>
                </div>
              ) : entity === "reviews" ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#1a1a1a]">Reviews</h2>
                  <div className="w-full overflow-x-auto">
                    <ReviewsTable reviews={data.reviews} />
                  </div>
                </div>
              ) : entity === "guides" ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#1a1a1a]">Guides</h2>
                  <div className="w-full overflow-x-auto">
                    <GuidesTable guides={data.guides} />
                  </div>
                </div>
              ) : entity === "bookings" ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#1a1a1a]">Bookings</h2>
                  <div className="w-full overflow-x-auto">
                    <BookingsTable bookings={data.bookings} />
                  </div>
                </div>
              ) : entity === "agency" ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#1a1a1a]">Agencies</h2>
                  <div className="w-full overflow-x-auto">
                    <AgenciesTable agencies={data.agencies} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-32">
                  <p className="text-2xl font-bold text-black/30 uppercase tracking-widest">No Data Available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#111111] text-[#f5f3f0] py-12 uppercase tracking-[0.15em] text-xs mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
            <span className="font-bold">© 2026 Echo Voyages Admin Portal</span>
            <span className="text-[9px] tracking-widest">Powered by Control</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
