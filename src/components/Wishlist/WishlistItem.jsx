import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "../../store/slices/wishlistSlice";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import "./WishlistItem.css";

const WishlistItem = ({ tour, onRemove }) => {
  const dispatch = useDispatch();

  const handleRemove = async (e) => {
    e.preventDefault(); // Prevent event bubbling
    try {
      // Remove from Firestore
      await deleteDoc(doc(db, "wishlist", tour.wishlistId));
      // Remove from Redux state
      dispatch(removeFromWishlist(tour.id));
      // Update parent component state
      onRemove(tour.id);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove tour from wishlist",
        icon: "error"
      });
    }
  };

  return (
    <div className="wishlist-item">
      <div
        className="wishlist-item-image"
        style={{ backgroundImage: `url(${tour.image})` }}
      />
      <div className="wishlist-item-content">
        <h3>{tour.title}</h3>
        <div className="wishlist-item-details">
          <span className="tour-price">${tour.price}</span>
          <span className="tour-duration">{tour.duration}</span>
        </div>
        <p>{tour.description}</p>
        <div className="wishlist-item-actions">
          <Link to={`/tours/${tour.id}`} className="btn-primary">
            View Details
          </Link>
          <button onClick={handleRemove} className="btn-secondary">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
