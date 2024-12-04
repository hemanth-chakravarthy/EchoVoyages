import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">EchoVoyages</a>
      </div>
      <div className="flex-none gap-2">
        <div className="flex space-x-4">
          <Link to={`/home`} className="btn btn-ghost">
            Home
          </Link>
          <Link to={`/search`} className="btn btn-ghost">
            Search
          </Link>
          <Link to={`/custProfilePage`} className="btn btn-ghost">
            Profile Page
          </Link>
          <Link to={`/customerWishlist`} className="btn btn-ghost">
            Wishlist
          </Link>
          <Link to={`/customerGuide`} className="btn btn-ghost">
            Guides
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
