import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../../store/slices/wishlistSlice";
import "./Tours.css";
import { Link } from "react-router-dom";

const Tours = () => {
  const [activeTab, setActiveTab] = useState("all");
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist);
  
  const tours = [
    {
      id: 3,
      name: "Swiss Alps",
      location: "Switzerland",
      price: 2500,
      duration: "6 days",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=80&w=1000&auto=format&fit=crop",
      category: "adventure",
    },
    {
      id: 4,
      name: "Tokyo City",
      location: "Japan",
      price: 1800,
      duration: "8 days",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop",
      category: "cultural",
    },
    {
      id: 6,
      name: "Machu Picchu",
      location: "Peru",
      price: 2200,
      duration: "7 days",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      category: "historical",
    },
  ];

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

  const filteredTours =
    activeTab === "all"
      ? tours
      : tours.filter((tour) => tour.category === activeTab);

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h1>Tour Packages</h1>
        <p>Discover our carefully curated selection of tours</p>
      </div>

      <div className="tours-filters">
        <button
          className={`filter-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Tours
        </button>
        <button
          className={`filter-btn ${activeTab === "adventure" ? "active" : ""}`}
          onClick={() => setActiveTab("adventure")}
        >
          Adventure
        </button>
        <button
          className={`filter-btn ${activeTab === "cultural" ? "active" : ""}`}
          onClick={() => setActiveTab("cultural")}
        >
          Cultural
        </button>
        <button
          className={`filter-btn ${activeTab === "historical" ? "active" : ""}`}
          onClick={() => setActiveTab("historical")}
        >
          Historical
        </button>
      </div>

      <div className="tours-grid">
        {filteredTours.map((tour) => {
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
                <h3>{tour.name}</h3>
                <div className="tour-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {tour.location}
                </div>
                <div className="tour-rating">
                  <i className="fas fa-star"></i>
                  {tour.rating}
                </div>
                <div className="tour-details">
                  <span className="tour-price">${tour.price}</span>
                  <span className="tour-duration">{tour.duration}</span>
                </div>
                <Link to={`/tours/${tours.id}`} className="btn-primary">View Details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tours;
