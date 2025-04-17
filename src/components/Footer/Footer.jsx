import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = ({
  newsletterEmail,
  handleNewsletterSubmit,
  setNewsletterEmail,
}) => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Wanderlust</h3>
          <p>Making travel dreams come true since 2010</p>
          <div className="social-links">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/tours">Tour Packages</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/terms">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/help">FAQs & Help Center</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe for travel tips and exclusive offers</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="search-input"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
