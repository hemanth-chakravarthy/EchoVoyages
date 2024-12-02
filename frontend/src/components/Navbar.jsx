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
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
