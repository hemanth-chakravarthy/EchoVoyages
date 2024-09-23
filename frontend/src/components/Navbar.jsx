import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <img src="../images/logo_ev-removebg-preview.png" className="nav--icon" />
            <div className="nav-elements">
            <Link to={`/home`} className="nav--element--2">Home</Link>
            <Link to={`/custProfilePage`} className="nav--element--2">Profile Page</Link>
            <Link to={`/customerWishlist`} className="nav--element--1">Wishlist</Link>
            </div>
        </nav>
    )
}