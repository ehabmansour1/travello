import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFirebase } from "../../contexts/FirebaseContext";
import Swal from "sweetalert2";
import "./FeaturedTours.css";

const FeaturedTours = ({ tours }) => {
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist);
  const { user } = useFirebase();
  const navigate = useNavigate();

  const handleWishlistToggle = async (tour) => {
    if (!user) {
      await Swal.fire({
        title: "Login Required",
        text: "Please login to add tours to your wishlist",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel"
      });
      navigate("/login");
      return;
    }

    const isInWishlist = wishlistState.items.some((item) => item.id === tour.id);
    const wishlistRef = doc(db, "wishlist", `${user.uid}_${tour.id}`);

    try {
      if (isInWishlist) {
        // Remove from Firestore
        await deleteDoc(wishlistRef);
        // Remove from Redux
        dispatch(removeFromWishlist(tour.id));
      } else {
        // Add to Firestore
        await setDoc(wishlistRef, {
          userId: user.uid,
          tourId: tour.id,
          tour: tour,
          createdAt: new Date().toISOString()
        });
        // Add to Redux
        dispatch(addToWishlist(tour));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update wishlist. Please try again.",
        icon: "error"
      });
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
