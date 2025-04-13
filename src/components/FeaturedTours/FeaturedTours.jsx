import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import "./FeaturedTours.css";

const FeaturedTours = ({ tours }) => {
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist);

  const handleWishlistToggle = (tour) => {
    const isInWishlist = wishlistState.items.some(
      (item) => item.id === tour.id
    );
    if (isInWishlist) {
      dispatch(removeFromWishlist(tour.id));
    } else {
      dispatch(addToWishlist(tour));
    }
  };

  return (
    <section className="featured-tours">
      <div className="section-header">
        <h2>Featured Tour Packages</h2>
        <p>Curated experiences for unforgettable journeys</p>
      </div>

      <div className="home-tours-grid">
        {tours.map((tour) => {
          const isInWishlist = wishlistState.items.some(
            (item) => item.id === tour.id
          );
          return (
            <div key={tour.id} className="tour-card">
              <div
                className="tour-image"
                style={{ backgroundImage: `url(${tour.image})` }}
              >
                <button
                  className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
                  onClick={() => handleWishlistToggle(tour)}
                >
                  <i className={`fas fa-heart`}></i>
                </button>
              </div>
              <div className="tour-content">
                <h3>{tour.title}</h3>
                <div className="tour-rating">★ {tour.rating}</div>
                <p>{tour.description}</p>
                <div className="tour-details">
                  <span className="tour-price">${tour.price}</span>
                  <span className="tour-duration">{tour.duration}</span>
                </div>
                <Link to={`/tours/${tour.id}`} className="btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedTours;
