import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseContext";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, getUserData } = useFirebase();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const userData = await getUserData(user.uid);
          setUserRole(userData?.role || "user");
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRole();
  }, [user, getUserData]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      closeMobileMenu();
    } catch (error) {
      console.error("Error logging out:", error);
    }
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

          {user ? (
            <>
              {!isLoading && userRole === "admin" ? (
                <Link
                  to="/admin-dashboard"
                  className={`nav-link ${
                    location.pathname === "/admin-dashboard" ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/user-dashboard"
                  className={`nav-link ${
                    location.pathname === "/user-dashboard" ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-secondary"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </>
          )}
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
