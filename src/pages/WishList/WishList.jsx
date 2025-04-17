import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useFirebase } from "../../contexts/FirebaseContext";
import WishlistItem from "../../components/Wishlist/WishlistItem";
import Swal from "sweetalert2";
import "./WishList.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date-added");
  const { user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        await Swal.fire({
          title: "Login Required",
          text: "Please login to view your wishlist",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Login",
          cancelButtonText: "Cancel"
        });
        navigate("/login");
        return;
      }

      try {
        const wishlistCollection = collection(db, "wishlist");
        const q = query(wishlistCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => ({
          ...doc.data().tour,
          wishlistId: doc.id,
          createdAt: doc.data().createdAt
        }));
        
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load wishlist items",
          icon: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  const handleRemoveFromWishlist = (tourId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== tourId));
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "date-added":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="loading">Loading wishlist...</div>
      </div>
    );
  }

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
              </select>
            </div>

            <div className="filter-stats">
              <span>{wishlistItems.length}</span> tours saved
            </div>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="wishlist-grid">
              {sortedItems.map((tour) => (
                <WishlistItem 
                  key={tour.wishlistId} 
                  tour={tour} 
                  onRemove={handleRemoveFromWishlist}
                />
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
