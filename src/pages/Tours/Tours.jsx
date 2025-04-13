import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import "./Tours.css";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Tours = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist);

  // Fetch tours from Firestore
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, "tours");
        const tourSnapshot = await getDocs(toursCollection);
        const tourList = tourSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTours(tourList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

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

  if (loading) {
    return (
      <div className="tours-page">
        <div className="loading">Loading tours...</div>
      </div>
    );
  }

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
          className={`filter-btn ${activeTab === "beach" ? "active" : ""}`}
          onClick={() => setActiveTab("beach")}
        >
          Beach
        </button>
        <button
          className={`filter-btn ${activeTab === "mountain" ? "active" : ""}`}
          onClick={() => setActiveTab("mountain")}
        >
          Mountain
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
                <h3>{tour.title}</h3>
                <div className="tour-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {tour.location || 'Location not specified'}
                </div>
                <div className="tour-rating">
                  <i className="fas fa-star"></i>
                  {tour.rating || 0}
                </div>
                <div className="tour-details">
                  <span className="tour-price">${tour.price}</span>
                  <span className="tour-duration">{tour.duration} days</span>
                </div>
                <Link to={`/tours/${tour.id}`} className="btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredTours.length === 0 && (
        <div className="no-tours">
          <p>No tours found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Tours;
