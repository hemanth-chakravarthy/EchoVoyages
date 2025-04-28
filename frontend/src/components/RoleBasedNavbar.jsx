import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

const RoleBasedNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get token and determine user role
    const token = localStorage.getItem('token');
    let role = 'guest';
    let name = '';

    try {
      if (token) {
        const decoded = jwtDecode(token);
        // Check for both 'userType' and 'role' fields in the token
        let extractedRole = decoded.userType || decoded.role || 'guest';

        // Make sure the role is one of our expected roles
        if (!['agency', 'guide', 'customer', 'guest'].includes(extractedRole)) {
          console.warn('Navbar: Unexpected role in token:', extractedRole, 'Defaulting to guest');
          extractedRole = 'guest';
        }

        role = extractedRole;
        name = decoded.name || '';
        console.log('Navbar: User role from token:', role, 'User name:', name, 'Full decoded token:', decoded);
      } else {
        console.log('Navbar: No token found, setting role to guest');
      }
    } catch (error) {
      console.error('Error decoding token in navbar:', error);
    }

    setUserRole(role);
    setUserName(name);
    console.log('Navbar: Final role set to:', role);
  }, [location.pathname]); // Re-check when route changes

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Define navigation links for each role
  const navLinks = {
    agency: [
      { to: "/AgentHome", text: "Booking Requests" },
      { to: "/mylistings", text: "My Packages" },
      { to: "/createPackage", text: "Create Package" },
      { to: "/agency-guide-requests", text: "Guide Requests" },
      { to: "/agency-guide-directory", text: "Guide Directory" },
      { to: "/AgentProfilePage", text: "Profile" }
    ],
    guide: [
      { to: "/GuideHome", text: "Dashboard" },
      { to: "/guide-requests", text: "My Requests" },
      { to: "/home", text: "Browse Packages" },
      { to: "/GuideProfile", text: "Profile" }
    ],
    customer: [
      { to: "/home", text: "Home" },
      { to: "/search", text: "Search" },
      { to: "/wishlist", text: "Wishlist" },
      // { to: "/mybookings", text: "My Bookings" },
      { to: "/profile", text: "Profile" }
    ],
    guest: [
      { to: "/", text: "Home" },
      { to: "/about", text: "About" },
      { to: "/login", text: "Login" },
      { to: "/signup", text: "Sign Up" }
    ]
  };

  // Get the appropriate links based on user role
  console.log('Navbar: Getting links for role:', userRole);
  const links = navLinks[userRole] || navLinks.guest;
  console.log('Navbar: Selected links:', links);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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
            <Link to={userRole === 'guest' ? '/' : `/${userRole === 'agency' ? 'AgentHome' : userRole === 'guide' ? 'GuideHome' : 'home'}`}
              className="flex-shrink-0 flex items-center">
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'bg-[#1a365d] text-white'
                    : 'text-[#2d3748] hover:bg-gray-100 hover:text-[#1a365d]'
                }`}
              >
                {link.text}
              </Link>
            ))}
            {/* {userRole !== 'guest' && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
              >
                Logout
              </button>
            )} */}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#1a365d] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1a365d]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.to)
                    ? 'bg-[#1a365d] text-white'
                    : 'text-[#2d3748] hover:bg-gray-100 hover:text-[#1a365d]'
                }`}
              >
                {link.text}
              </Link>
            ))}
            {userRole !== 'guest' && (
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-800"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default RoleBasedNavbar;
