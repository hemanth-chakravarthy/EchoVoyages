/** @format */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  FaHome,
  FaClipboardList,
  FaBox,
  FaUserPlus,
  FaUsers,
  FaCreditCard,
  FaUser,
  FaTachometerAlt,
  FaPaperPlane,
  FaCompass,
  FaHeart,
  FaBookmark,
  FaSignInAlt,
  FaUserCircle,
  FaInfoCircle,
  FaSignOutAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const RoleBasedNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("guest");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get token and determine user role
    const token = localStorage.getItem("token");
    let role = "guest";
    let name = "";

    try {
      if (token) {
        const decoded = jwtDecode(token);
        // Check for both 'userType' and 'role' fields in the token
        let extractedRole = decoded.userType || decoded.role || "guest";

        // Make sure the role is one of our expected roles
        if (!["agency", "guide", "customer", "guest"].includes(extractedRole)) {
          console.warn(
            "Navbar: Unexpected role in token:",
            extractedRole,
            "Defaulting to guest"
          );
          extractedRole = "guest";
        }

        role = extractedRole;
        name = decoded.name || "";
        console.log(
          "Navbar: User role from token:",
          role,
          "User name:",
          name,
          "Full decoded token:",
          decoded
        );
      } else {
        console.log("Navbar: No token found, setting role to guest");
      }
    } catch (error) {
      console.error("Error decoding token in navbar:", error);
    }

    setUserRole(role);
    setUserName(name);
    console.log("Navbar: Final role set to:", role);
  }, [location.pathname]); // Re-check when route changes

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Define navigation links for each role
  const navLinks = {
    agency: [
      { to: "/AgentHome", text: "Booking Requests", icon: <FaClipboardList /> },
      { to: "/mylistings", text: "My Packages", icon: <FaBox /> },
      { to: "/createPackage", text: "Create Package", icon: <FaUserPlus /> },
      {
        to: "/agency-guide-requests",
        text: "Guide Requests",
        icon: <FaPaperPlane />,
      },
      {
        to: "/agency-guide-directory",
        text: "Guide Directory",
        icon: <FaUsers />,
      },
      {
        to: "/agency-payments",
        text: "Guide Payments",
        icon: <FaCreditCard />,
      },
      { to: "/AgentProfilePage", text: "Profile", icon: <FaUser /> },
    ],
    guide: [
      { to: "/GuideHome", text: "Dashboard", icon: <FaTachometerAlt /> },
      { to: "/guide-requests", text: "My Requests", icon: <FaClipboardList /> },
      { to: "/home", text: "Browse Packages", icon: <FaCompass /> },
      { to: "/GuideProfile", text: "Profile", icon: <FaUserCircle /> },
      { to: "/all-bookings", text: "All Bookings", icon: <FaCalendarCheck /> },
    ],
    customer: [
      { to: "/home", text: "Home", icon: <FaHome /> },
      { to: "/search", text: "Search", icon: <FaCompass /> },
      { to: "/wishlist", text: "Wishlist", icon: <FaHeart /> },
      { to: "/customerGuide", text: "Guides", icon: <FaUsers /> },
      { to: "/profile", text: "Profile", icon: <FaUserCircle /> },
    ],
    guest: [
      { to: "/", text: "Home", icon: <FaHome /> },
      { to: "/about", text: "About", icon: <FaInfoCircle /> },
      { to: "/login", text: "Login", icon: <FaSignInAlt /> },
      { to: "/signup", text: "Sign Up", icon: <FaUserPlus /> },
    ],
  };

  // Get the appropriate links based on user role
  console.log("Navbar: Getting links for role:", userRole);
  const links = navLinks[userRole] || navLinks.guest;
  console.log("Navbar: Selected links:", links);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={
                userRole === "guest"
                  ? "/"
                  : `/${userRole === "agency" ? "AgentHome" : userRole === "guide" ? "GuideHome" : "home"}`
              }
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-2xl font-bold text-[#1a365d]">Echo</span>
              <span className="text-2xl font-bold text-[#4299e1]">Voyages</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  isActive(link.to)
                    ? "bg-[#0a66c2] text-white"
                    : "text-gray-700 hover:bg-[#0a66c2]/10 hover:text-[#0a66c2]"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.text}</span>
              </Link>
            ))}
            {userRole !== "guest" && (
              <>
                {userName && (
                  <div className="px-4 py-2 text-sm font-medium text-[#0a66c2] flex items-center">
                    <FaUserCircle className="mr-2 text-lg" />
                    Welcome, {userName}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu items */}
          {isOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium ${
                      isActive(link.to)
                        ? "bg-[#0a66c2] text-white"
                        : "text-gray-700 hover:bg-[#0a66c2]/10 hover:text-[#0a66c2]"
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.text}</span>
                  </Link>
                ))}
                {userRole !== "guest" && (
                  <>
                    {userName && (
                      <div className="px-3 py-2 text-base font-medium text-[#1a365d] border-t border-gray-200 mt-2 pt-2">
                        Welcome, {userName}
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-3 py-2 mt-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-sm"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavbar;
