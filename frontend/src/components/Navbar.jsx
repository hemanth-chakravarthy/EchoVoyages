import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
        <nav>
            <img src="../images/logo_ev-removebg-preview.png" className="nav--icon" />
            <div className="nav-elements">
            <Link to={`/home`} className="nav--element--2">Home</Link>
            <Link to={`/search`} className="nav--element--2">Search</Link>
            <Link to={`/custProfilePage`} className="nav--element--2">Profile Page</Link>
            <Link to={`/customerWishlist`} className="nav--element--1">Wishlist</Link>
            <Link to={`/customerGuide`} className="nav--element--2">Guides</Link>
            </div>
        </nav>
    </div>
  )
}
export default Navbar