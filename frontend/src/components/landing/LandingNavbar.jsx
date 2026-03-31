import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingNavbar = ({ navIsWhite }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ===== FIXED NAVBAR (outside all scroll/animation layers) ===== */}
      <nav
        style={{ zIndex: 9999 }}
        className={`fixed top-0 left-0 w-full flex items-start pt-6 px-10 font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.2em] leading-relaxed transition-colors duration-500 ${navIsWhite ? 'text-white' : 'text-black'}`}
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
        <div className={`hidden md:flex shrink-0 items-center gap-4 backdrop-blur-md px-6 py-3 rounded-2xl border transition-colors duration-500 ${navIsWhite ? 'bg-white/20 border-white/30' : 'bg-black/10 border-black/20'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7 4.5 9.5l7 3.5-4 4-3.5-.5L2.5 18l4.5 1.5 1.5 4.5 1.5-1.5-.5-3.5 4-4 3.5 7 1.8-1.8z" />
          </svg>
          <div className={`w-px h-6 transition-colors duration-500 ${navIsWhite ? 'bg-white/50' : 'bg-black/30'}`}></div>
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
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
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
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase text-center mb-12">
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/home'); }} className="hover:opacity-70 transition-opacity">Home</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }} className="hover:opacity-70 transition-opacity text-white/50">Destinations</button>
        </div>
        <div className="flex gap-6 uppercase tracking-widest text-[10px] font-bold">
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="bg-white/10 px-6 py-3 rounded-full">Login</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="bg-white text-black px-6 py-3 rounded-full">Register</button>
        </div>
      </div>
    </>
  );
};

export default LandingNavbar;
