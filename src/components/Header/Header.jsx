import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      <nav>
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <div className="logo">
            <div className="logo-symbol">T</div>
            <span>Travello</span>
          </div>
        </Link>
        <div className={`nav-items ${isMobileMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/tours"
            className={`nav-link ${
              location.pathname === "/tours" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            Tour Packages
          </Link>
          <Link
            to="/wishlist"
            className={`nav-link ${
              location.pathname === "/wishlist" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            Wishlist
          </Link>
          <Link
            to="/about"
            className={`nav-link ${
              location.pathname === "/about" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            Contact Us
          </Link>
          <Link to="/login" className="btn-secondary" onClick={closeMobileMenu}>
            Login
          </Link>
          <Link
            to="/register"
            className="btn-primary"
            onClick={closeMobileMenu}
          >
            Sign Up
          </Link>
          <Link
            to="/user-dashboard"
            className="btn-primary"
            onClick={closeMobileMenu}
          >
            UserDashboard
          </Link>
          <Link
            to="/admin-dashboard"
            className="btn-primary"
            onClick={closeMobileMenu}
          >
            AdminDashboard
          </Link>
        </div>
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
