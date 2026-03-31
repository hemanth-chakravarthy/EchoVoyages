/** @format */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiUrl from "../utils/api.js";
import backgroundVideo from "./assets/Girl_Enters_Cosmic_Dream_World.mp4";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [adminError, setAdminError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setErrors({ login: "Username and password are required." });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/customers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        if (data.role === "customer") {
          navigate("/realhome");
        } else if (data.role === "agency") {
          navigate("/AgentHome");
        } else if (data.role === "guide") {
          navigate("/guideHome");
        } else {
          setErrors({ login: "Unknown user role" });
        }
      } else {
        const data = await response.json();
        setErrors({ login: data.msg || "Login failed." });
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setErrors({ login: "Server error. Please try again later." });
    }
  };

  const handleAdminLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/customers/adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdminModalOpen(false);
        navigate("/admin");
      } else {
        setAdminError(data.error || "Invalid admin credentials.");
      }
    } catch (err) {
      console.error("Error during admin login:", err);
      setAdminError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-black text-white font-sans">
      
      {/* ===== FIXED NAVBAR (same as landing page) ===== */}
      <nav
        style={{ zIndex: 9999 }}
        className="fixed top-0 left-0 w-full flex items-start pt-6 px-4 sm:px-10 font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.2em] leading-relaxed text-white"
      >
        {/* ── LEFT ZONE (flex-1): Logo + Nav Links ── */}
        <div className="flex-1 flex items-start gap-8">
          <button onClick={() => navigate('/')} className="uppercase flex flex-col text-xs sm:text-sm font-black text-left leading-tight shrink-0">
            <span>Echo</span>
            <span>Voyage</span>
          </button>
          <div className="hidden lg:flex gap-8">
            <div className="flex flex-col gap-1 uppercase opacity-80">
              <button onClick={() => navigate('/home')} className="hover:opacity-100 transition-opacity text-left">Homepage</button>
              <button className="hover:opacity-100 transition-opacity text-left">Contact</button>
            </div>
            <div className="flex flex-col gap-1 uppercase opacity-80">
              <button onClick={() => navigate('/search')} className="hover:opacity-100 transition-opacity text-left">Destinations</button>
            </div>
          </div>
        </div>

        {/* ── CENTER (shrink-0): Icons Pill — always true center ── */}
        <div className="hidden md:flex shrink-0 items-center gap-4 backdrop-blur-md px-6 py-3 rounded-2xl border transition-colors duration-500 bg-white/10 border-white/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7 4.5 9.5l7 3.5-4 4-3.5-.5L2.5 18l4.5 1.5 1.5 4.5 1.5-1.5-.5-3.5 4-4 3.5 7 1.8-1.8z" />
          </svg>
          <div className="w-px h-6 bg-white/30 transition-colors duration-500"></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14M7 10h2M7 14h2M15 10h2M15 14h2" />
          </svg>
        </div>

        {/* ── RIGHT ZONE (flex-1): Language + Search + Auth ── */}
        <div className="flex-1 hidden lg:flex justify-end items-start gap-8">
          <div className="flex flex-col gap-1 uppercase opacity-80">
            <span className="font-black">English</span>
          </div>
          <div className="flex items-center gap-1 uppercase opacity-80 cursor-pointer hover:opacity-100 transition-opacity">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Search</span>
          </div>
          <div className="flex flex-col gap-1 uppercase opacity-80">
            <button onClick={() => navigate('/login')} className="hover:opacity-100 transition-opacity text-left">Login</button>
            <button onClick={() => navigate('/signup')} className="hover:opacity-100 transition-opacity text-left">Register</button>
          </div>
        </div>

        {/* Hamburger - Mobile only */}
        <div className="flex-1 flex lg:hidden justify-end">
          <button className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        style={{ zIndex: 10000 }}
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl text-white flex flex-col items-center justify-center p-8 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button className="absolute top-8 right-10 hover:opacity-70 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase text-center mb-12">
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/home'); }} className="hover:opacity-70 transition-opacity">Home</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }} className="hover:opacity-70 transition-opacity">Destinations</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }} className="hover:opacity-70 transition-opacity">Contact</button>
        </div>
        <div className="flex gap-8 text-sm font-black tracking-widest uppercase text-[#888]">
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="hover:text-white transition-colors">Login</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="hover:text-white transition-colors">Register</button>
        </div>
      </div>

      {/* LEFT PANE - Image/Video */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[55%] relative h-full bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      {/* RIGHT PANE - Form */}
      <div className="w-full lg:w-[50%] xl:w-[45%] h-full flex flex-col pt-32 px-8 sm:px-16 md:px-24 lg:px-16 xl:px-24 relative overflow-y-auto">
        
        <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center pb-24">
          
          {/* Main Title Row */}
          <div className="flex items-center space-x-6 sm:space-x-10 mb-16">
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight flex items-center">
              <span className="w-3 h-3 rounded-full bg-white mr-4"></span>
              Log in
            </h1>
            <Link to="/signup" className="text-4xl sm:text-5xl font-normal tracking-tight flex items-center text-[#444] hover:text-[#888] transition-colors">
              <span className="w-3 h-3 rounded-full bg-[#444] mr-4"></span>
              Sign up
            </Link>
          </div>

          {errors.login && (
            <div className="bg-[#111] border border-red-500/50 text-white px-4 py-3 rounded-md mb-8 text-sm">
              <span>{errors.login}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Username Input */}
              <div className="flex flex-col">
                <label htmlFor="username" className="text-sm font-semibold mb-2 text-white/90">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full bg-transparent border border-[#333] rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-semibold mb-2 text-white/90">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full bg-transparent border border-[#333] rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-md hover:bg-gray-200 transition-colors mt-2"
            >
              Log in
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-20 space-y-1.5 text-xs text-[#888]">
            <p>Forgot your password? <Link to="/forgot-password" className="text-white hover:underline ml-1 font-semibold">Reset here</Link></p>
            <p>Trouble logging in? <button type="button" onClick={() => setIsAdminModalOpen(true)} className="text-white hover:underline ml-1 font-semibold">Admin Portal</button></p>
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#050505] border border-[#333] rounded-2xl p-8 sm:p-12 w-full max-w-lg relative shadow-2xl">
            <button 
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute top-6 right-6 text-[#666] hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <h2 className="text-3xl font-normal text-white mb-10 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-white mr-4"></span>
              Admin <span className="text-[#444] ml-2">Portal</span>
            </h2>
            
            {adminError && (
              <div className="bg-[#111] border border-red-500/50 text-white px-4 py-3 rounded-md mb-6 text-sm">
                <span>{adminError}</span>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 block text-white/90">Admin ID</label>
                <input
                  type="text"
                  placeholder="Enter Admin ID"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                  className="w-full bg-transparent border border-[#333] rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-white/90">Authorization Key</label>
                <input
                  type="password"
                  placeholder="Enter Key"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                  className="w-full bg-transparent border border-[#333] rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors"
                />
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-white text-black font-bold py-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Authenticate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
