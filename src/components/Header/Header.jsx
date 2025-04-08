import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <header>
      <nav>
        <div className="logo">
          <div className="logo-symbol">T</div>
          <span>Travello</span>
        </div>
        <div className="nav-items">
          <Link
            to="/home"
            className={`nav-link ${
              location.pathname === "/home" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/tours"
            className={`nav-link ${
              location.pathname === "/tours" ? "active" : ""
            }`}
          >
            Tour Packages
          </Link>
          <Link
            to="/wishlist"
            className={`nav-link ${
              location.pathname === "/wishlist" ? "active" : ""
            }`}
          >
            Wishlist
          </Link>
          <Link
            to="/about"
            className={`nav-link ${
              location.pathname === "/about" ? "active" : ""
            }`}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
          >
            Contact Us
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Sign Up
          </Link>
          <Link to="/user-dashboard" className="btn-primary">
            UserDashboard
          </Link>
          <Link to="/admin-dashboard" className="btn-primary">
            AdminDashboard
          </Link>
        </div>
        <div className="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
