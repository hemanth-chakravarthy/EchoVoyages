import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        const role = decoded.userType || decoded.role || "guest";
        setUserRole(role);
      } catch (error) {
        console.error("Error decoding token in Navbar:", error);
        setUserRole("guest");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole("guest");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Define navigation groups based on role
  const getNavLinks = () => {
    if (!isLoggedIn) {
      return {
        group1: [
          { to: "/", text: "Homepage" },
          { to: "#contact", text: "Contact" }
        ],
        group2: [
          { to: "/search", text: "Destinations" }
        ],
        auth: [
          { to: "/login", text: "Login" },
          { to: "/signup", text: "Register" }
        ]
      };
    }

    switch (userRole) {
      case "admin":
        return {
          group1: [
            { to: "/admin", text: "Dashboard" },
            { to: "/realhome", text: "Site View" }
          ],
          group2: [],
          auth: [
            { to: "#logout", text: "Logout", isLogout: true }
          ]
        };
      case "agency":
      case "agent":
        return {
          group1: [
            { to: "/AgentHome", text: "Booking Requests" },
            { to: "/mylistings", text: "My Packages" }
          ],
          group2: [
            { to: "/agency-guide-requests", text: "Guide Requests" },
            { to: "/agency-guide-directory", text: "Directory" }
          ],
          auth: [
            { to: "/AgentProfilePage", text: "Profile" },
            { to: "#logout", text: "Logout", isLogout: true }
          ]
        };
      case "guide":
        return {
          group1: [
            { to: "/GuideHome", text: "Dashboard" },
            { to: "/guide-requests", text: "My Requests" }
          ],
          group2: [
            { to: "/home", text: "Browse Packages" },
            { to: "/all-bookings", text: "All Bookings" }
          ],
          auth: [
            { to: "/GuideProfile", text: "Profile" },
            { to: "#logout", text: "Logout", isLogout: true }
          ]
        };
      case "customer":
      default:
        return {
          group1: [
            { to: "/home", text: "Home" }
          ],
          group2: [
            { to: "/customerGuide", text: "Guides" }
          ],
          auth: [
            { to: "/profile", text: "Profile" },
            { to: "/wishlist", text: "Wishlist" },
            { to: "#logout", text: "Logout", isLogout: true }
          ]
        };
    }
  };

  const links = getNavLinks();

  const handleNav = (to, isLogout) => {
    setIsMobileMenuOpen(false);
    if (isLogout) {
      handleLogout();
    } else if (to.startsWith("/")) {
      navigate(to);
    }
  };

  return (
    <>
      <nav
        style={{ zIndex: 9999 }}
        className="fixed top-0 left-0 w-full flex items-start pt-6 px-10 font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.2em] leading-relaxed text-black transition-all duration-300"
      >
        {/* ── LEFT ZONE: Logo + Nav Links ── */}
        <div className="flex-1 flex items-start gap-8">
          <button 
            onClick={() => handleNav(isLoggedIn ? (userRole === 'agency' || userRole === 'agent' ? '/AgentHome' : userRole === 'guide' ? '/GuideHome' : '/realhome') : '/')} 
            className="uppercase flex flex-col text-xs sm:text-sm font-black text-left leading-tight shrink-0 text-black hover:opacity-70 transition-opacity"
          >
            <span>Echo</span>
            <span>Voyage</span>
          </button>

          <div className="hidden lg:flex gap-8">
            <div className="flex flex-col gap-1 uppercase opacity-80">
              {links.group1.map((link, i) => (
                <button key={i} onClick={() => handleNav(link.to)} className="hover:opacity-100 transition-opacity text-left">{link.text}</button>
              ))}
            </div>
            {links.group2.length > 0 && (
              <div className="flex flex-col gap-1 uppercase opacity-80">
                {links.group2.map((link, i) => (
                  <button key={i} onClick={() => handleNav(link.to)} className="hover:opacity-100 transition-opacity text-left">{link.text}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CENTER: Icons Pill ── */}
        <div className="hidden md:flex shrink-0 items-center gap-4 backdrop-blur-md px-6 py-3 rounded-2xl border transition-colors duration-500 bg-black/10 border-black/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7 4.5 9.5l7 3.5-4 4-3.5-.5L2.5 18l4.5 1.5 1.5 4.5 1.5-1.5-.5-3.5 4-4 3.5 7 1.8-1.8z" />
          </svg>
          <div className="w-px h-6 bg-black/20 transition-colors duration-500"></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14M7 10h2M7 14h2M15 10h2M15 14h2" />
          </svg>
        </div>

        {/* ── RIGHT ZONE: Language + Search + Auth ── */}
        <div className="flex-1 hidden lg:flex justify-end items-start gap-8">
          <div className="flex flex-col gap-1 uppercase opacity-80">
            <span className="font-black">English</span>
          </div>
          <div onClick={() => handleNav('/search')} className="flex items-center gap-1 uppercase opacity-80 cursor-pointer hover:opacity-100 transition-opacity mt-0.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search</span>
          </div>

          <div className="flex flex-col gap-1 uppercase opacity-80">
            {links.auth.map((link, i) => (
              <button 
                key={i} 
                onClick={() => handleNav(link.to, link.isLogout)} 
                className={`hover:opacity-100 transition-opacity text-left ${link.isLogout ? 'text-[#a00000] font-bold' : ''}`}
              >
                {link.text}
              </button>
            ))}
          </div>
        </div>

        {/* Hamburger - Mobile only */}
        <div className="flex-1 flex lg:hidden justify-end">
          <button className="hover:opacity-80 p-2 -mr-2 text-black" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* HEADER MOBILE MENU OVERLAY */}
      <div
        style={{ zIndex: 10000 }}
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl text-white flex flex-col items-center justify-center p-8 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button className="absolute top-8 right-10 hover:opacity-70 transition-opacity text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase text-center mb-12">
          {links.group1.map((link, i) => (
            <button key={i} onClick={() => handleNav(link.to)} className="hover:opacity-70 transition-opacity">{link.text}</button>
          ))}
          {links.group2.map((link, i) => (
            <button key={i} onClick={() => handleNav(link.to)} className="hover:opacity-70 transition-opacity text-white/50">{link.text}</button>
          ))}
        </div>
        
        <div className="flex gap-4 uppercase tracking-widest text-[10px] font-bold flex-wrap justify-center">
          {links.auth.map((link, i) => (
            <button 
              key={i} 
              onClick={() => handleNav(link.to, link.isLogout)} 
              className={`${link.isLogout ? 'bg-red-600/90 text-white' : 'bg-white/10'} px-6 py-3 rounded-full`}
            >
              {link.text}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
export default Navbar;
