import React from "react";

export default function Navbar() {
    return (
        <nav>
            <img src="../images/logo_ev-removebg-preview.png" className="nav--icon" />
            <div className="nav-elements">
                <h4 className="nav--element--2">Wishlist</h4>
                <h4 className="nav--element--1 ">Profile</h4>
            </div>
        </nav>
    )
}