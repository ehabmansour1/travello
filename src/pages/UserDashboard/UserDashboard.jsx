import "./UserDashboard.css";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFirebase } from "../../contexts/FirebaseContext";
import WishlistItem from "../../components/Wishlist/WishlistItem";
import { removeFromWishlist } from "../../store/slices/wishlistSlice";
import Swal from "sweetalert2";
import userPic from "../../assets/images/user.png";


const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);
  const dispatch = useDispatch();
  const { user, getUserData } = useFirebase();
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, getUserData]);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) return;

        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt.toDate().toISOString().split('T')[0]
        }));

        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  useEffect(() => {
    const filterBookings = () => {
      let filtered = [...bookings];

      if (statusFilter !== "all") {
        filtered = filtered.filter(booking => booking.status.toLowerCase() === statusFilter);
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(booking => 
          booking.tourTitle.toLowerCase().includes(searchLower)
        );
      }

      setFilteredBookings(filtered);
    };

    filterBookings();
  }, [statusFilter, searchTerm, bookings]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
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
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemoveFromWishlist = async (tour) => {
    try {
      setLoading(true); // Show loading state
      
      // Remove from Firestore
      await deleteDoc(doc(db, "wishlist", tour.wishlistId));
      
      // Remove from Redux state
      dispatch(removeFromWishlist(tour.id));
      
      // Update local state
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== tour.id));
      
      // Show success message
      Swal.fire({
        title: "Success",
        text: "Tour removed from wishlist",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to remove tour from wishlist. Please try again.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const downloadDocument = (type, id) => {
    alert(`Downloading ${type} for booking ${id}`);
  };
  

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
          <Link to="/userProfile" className="user-info-link">
              <div className="user-info">
                <img
                  src={
                    userData?.profilePic || userPic // Use user's profile picture or default
                  }
                  alt="Profile"
                  className="avatar"
                />
                <div className="user-details">
                  <h3>{userData?.name || "User"}</h3>
                  <p>From {new Date(userData?.createdAt).toLocaleDateString()}</p>
                  <p className="user-email">{userData?.email}</p>
                </div>
              </div>
            </Link>
            <a
              href="#overview"
              className={activeTab === "overview" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("overview");
              }}
            >
              Overview
            </a>
            <a
              href="#bookings"
              className={activeTab === "bookings" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("bookings");
              }}
            >
              My Bookings
            </a>
            <a
              href="#wishlist"
              className={activeTab === "wishlist" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("wishlist");
              }}
            >
              WishList
            </a>
            <a
              href="#invoices"
              className={activeTab === "invoices" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("invoices");
              }}
            >
              Invoices
            </a>
          </nav>
        </div>

        <div className="dashboard-main">
          {activeTab === "overview" && (
            <div className="dashboard-tab active" id="overview">
              <div className="welcome-section">
                <h1>Welcome back, {userData?.name || "User"}!</h1>
                <p>Here's what's happening with your travel plans</p>
              </div>
              <div className="user-stats-grid">
                <div className="stat-card">
                  <i className="fas fa-plane"></i>
                  <div className="stat-info">
                    <h3>{bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}</h3>
                    <p>Upcoming Trips</p>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-heart"></i>
                  <div className="stat-info">
                    <h3>{wishlistItems.length}</h3>
                    <p>Saved Trips</p>
                  </div>
                </div>
              </div>
              <div className="upcoming-trips">
                <h2>Upcoming Trips</h2>
                <div className="trip-cards">
                  {loading ? (
                    <p>Loading trips...</p>
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <div key={booking.id} className="trip-card">
                        <span className={`user-status-badge ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                        <div className="trip-content">
                          <div className="trip-date">{new Date(booking.date).toLocaleDateString()}</div>
                          <h3>{booking.tourTitle}</h3>
                          <div className="trip-meta">
                            <span>
                              <i className="fas fa-users"></i> {booking.numTravelers} travelers
                            </span>
                            
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming trips found</p>
                  )}
                </div>
              </div>
              <div className="upcoming-trips">
                <h2>Saved Trips</h2>
                <div className="trip-cards">
                  {loading ? (
                    <p>Loading trips...</p>
                  ) : wishlistItems.length > 0 ? (
                    wishlistItems.map((wishlistItems) => (
                      <div key={wishlistItems.id} className="trip-card">
                      
                        <div className="trip-content">
                          <div className="trip-date">{wishlistItems.title}</div>
                          <h3>{wishlistItems.description}</h3>
                          
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming trips found</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "bookings" && (
            <div className="dashboard-tab active" id="bookings">
              <h2>My Bookings</h2>
              <div className="user-bookings-filters">
                <div className="filter-group">
                  <select 
                    className="user-filter-select"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Bookings</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="user-search-group">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="bookings-grid">
                {loading ? (
                  <p>Loading bookings...</p>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div key={booking.id} className="trip-card">
                      <span className={`user-status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                      <div className="trip-content">
                        <div className="trip-date">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <h3>{booking.tourTitle}</h3>
                        <div className="trip-meta">
                          <span>
                            <i className="fas fa-users"></i> {booking.numTravelers} travelers
                          </span>
                        </div>
                        
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No bookings found</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "wishlist" && (
            <div className="dashboard-tab active" id="wishlist">
              <h2>Saved Trips</h2>
              <div className="wishlist-container">
                {loading ? (
                  <p>Loading wishlist...</p>
                ) : wishlistItems.length > 0 ? (
                  wishlistItems.map((tour) => (
                    <WishlistItem 
                      key={tour.wishlistId} 
                      tour={tour} 
                      onRemove={() => handleRemoveFromWishlist(tour)} 
                    />
                  ))
                ) : (
                  <p>No saved trips available.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === "invoices" && (
            <div className="dashboard-tab active" id="invoices">
              <h2>Invoices & Documents</h2>
              <div className="invoices-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking #</th>
                      <th>Date</th>
                      <th>Tour</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>{booking.tourTitle}</td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          <span
                            className={`status-badge ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-secondary btn-sm"
                              onClick={() =>
                                downloadDocument('invoice', booking.id)
                              }
                            >
                              <i className="fas fa-download"></i>{" "}
                              Invoice
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;