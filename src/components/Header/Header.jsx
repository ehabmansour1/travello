import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <nav>
        <div className="logo">
          <div className="logo-symbol">T</div>
          <span>Travello</span>
        </div>
        <div className="nav-items">
          <Link to="/" className="nav-link active">
            Home
          </Link>
          <Link to="/tours" className="nav-link">
            Tour Packages
          </Link>
          <Link to="/bookings" className="nav-link">
            Bookings
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Sign Up
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
