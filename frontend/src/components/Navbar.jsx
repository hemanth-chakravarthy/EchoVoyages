import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-black/5 backdrop-blur-[2px] shadow-sm border-b border-black/10 w-full top-0 z-50">
      <div className="flex-1">
        <a className="text-xl font-bold text-[#1a365d] hover:text-[#4169E1] transition-colors duration-300" href="/realhome">
          EchoVoyages
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="flex space-x-4">
          <Link to={`/home`} className="text-[#2d3748] hover:text-[#4169E1] px-3 py-2 transition-colors duration-300">
            Home
          </Link>
          <Link to={`/search`} className="text-[#2d3748] hover:text-[#4169E1] px-3 py-2 transition-colors duration-300">
            Search
          </Link>
          <Link to={`/custProfilePage`} className="text-[#2d3748] hover:text-[#4169E1] px-3 py-2 transition-colors duration-300">
            Profile Page
          </Link>
          <Link to={`/customerWishlist`} className="text-[#2d3748] hover:text-[#4169E1] px-3 py-2 transition-colors duration-300">
            Wishlist
          </Link>
          <Link to={`/customerGuide`} className="text-[#2d3748] hover:text-[#4169E1] px-3 py-2 transition-colors duration-300">
            Guides
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
