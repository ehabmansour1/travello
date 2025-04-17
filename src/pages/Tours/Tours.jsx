import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import "./Tours.css";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFirebase } from "../../contexts/FirebaseContext";
import Swal from "sweetalert2";

const Tours = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist);
  const { user } = useFirebase();
  const navigate = useNavigate();

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

  // Load wishlist from Firestore
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) return;
      
      try {
        const wishlistCollection = collection(db, "wishlist");
        const querySnapshot = await getDocs(wishlistCollection);
        const userWishlistItems = querySnapshot.docs
          .filter(doc => doc.data().userId === user.uid)
          .map(doc => doc.data().tour);
          
        // Update Redux state with Firestore data
        userWishlistItems.forEach(tour => {
          if (!wishlistState.items.some(item => item.id === tour.id)) {
            dispatch(addToWishlist(tour));
          }
        });
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    loadWishlist();
  }, [user, dispatch, wishlistState.items]);

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

  const filteredTours =
    activeTab === "all"
      ? tours
      : tours.filter((tour) => tour.category === activeTab);

  // Calculate pagination
  const indexOfLastTour = currentPage * itemsPerPage;
  const indexOfFirstTour = indexOfLastTour - itemsPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
        {currentTours.map((tour) => {
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
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star ${index < (tour.rating || 0) ? 'active' : ''}`}
                  ></i>
                ))}
                <span className="rating-text">({tour.rating || 0}/5)</span>
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
      
      {filteredTours.length === 0 ? (
        <div className="no-tours">
          <p>No tours found in this category.</p>
        </div>
      ) : (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-left"></i>
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-right"></i>
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-double-right"></i>
          </button>

          <div className="items-per-page">
            <span>Items per page:</span>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tours;
