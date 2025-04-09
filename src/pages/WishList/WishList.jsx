import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WishlistItem from "../../components/Wishlist/WishlistItem";
import { selectWishlist } from "../../store/slices/wishlistSlice";
import "./WishList.css";

const Wishlist = () => {
  const wishlistItems = useSelector(selectWishlist);
  const [sortBy, setSortBy] = useState("date-added");

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration":
        return a.duration.localeCompare(b.duration);
      default:
        return 0;
    }
  });

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Save your dream destinations and plan your next adventure</p>
        </div>

        <div className="wishlist-content">
          <div className="wishlist-filters">
            <div className="filter-group">
              <label>Sort By:</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-added">Date Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <div className="filter-stats">
              <span>{wishlistItems.length}</span> tours saved
            </div>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="wishlist-grid">
              {sortedItems.map((tour) => (
                <WishlistItem key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="empty-wishlist">
              <div className="empty-wishlist-content">
                <i className="fas fa-heart empty-icon"></i>
                <h2>Your Wishlist is Empty</h2>
                <p>
                  Start exploring our tours and save your favorites for later!
                </p>
                <Link to="/tours" className="btn-primary">
                  Explore Tours
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Wishlist;
