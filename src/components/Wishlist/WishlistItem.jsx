import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "../../store/slices/wishlistSlice";
import "./WishlistItem.css";

const WishlistItem = ({ tour }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromWishlist(tour.id));
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
