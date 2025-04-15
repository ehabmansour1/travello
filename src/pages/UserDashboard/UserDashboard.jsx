import "./UserDashboard.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useFirebase } from "../../contexts/FirebaseContext";
import WishlistItem from "../../components/Wishlist/WishlistItem";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const wishlist = useSelector((state) => state.wishlist.items);
  const { user } = useFirebase();

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

  const activities = [
    {
      type: "booking",
      icon: "fa-calendar-check",
      text: "Booked Majestic Switzerland Tour",
      time: "2 days ago",
    },
    {
      type: "payment",
      icon: "fa-credit-card",
      text: "Made payment for Thailand Paradise",
      time: "5 days ago",
    },
    {
      type: "reward",
      icon: "fa-gift",
      text: "Earned 500 reward points",
      time: "1 week ago",
    },
  ];

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
            <div className="user-info">
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&rs=1&pid=ImgDetMain"
                alt="Profile"
                className="avatar"
              />
              <div className="user-details">
                <h3>John Doe</h3>
                <p>Member since 2025</p>
              </div>
            </div>
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
            <a
              href="#rewards"
              className={activeTab === "rewards" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("rewards");
              }}
            >
              Rewards
            </a>
          </nav>
        </div>

        <div className="dashboard-main">
          {activeTab === "overview" && (
            <div className="dashboard-tab active" id="overview">
              <div className="welcome-section">
                <h1>Welcome back, John!</h1>
                <p>Here's what's happening with your travel plans</p>
              </div>
              <div className="stats-grid">
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
                    <h3>12</h3>
                    <p>Saved Trips</p>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-map-marked-alt"></i>
                  <div className="stat-info">
                    <h3>8</h3>
                    <p>Countries Visited</p>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-star"></i>
                  <div className="stat-info">
                    <h3>2,500</h3>
                    <p>Reward Points</p>
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
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-timeline">
                  {activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <i className={`fas ${activity.icon}`}></i>
                      </div>
                      <div className="activity-content">
                        <p>{activity.text}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
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
                {wishlist.length > 0 ? (
                  wishlist.map((tour) => (
                    <WishlistItem key={tour.id} tour={tour} />
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
          {activeTab === "rewards" && (
            <div className="dashboard-tab active" id="rewards">
              <h2>Travel Rewards</h2>
              <div className="rewards-summary">
                <div className="points-card">
                  <h3>Available Points</h3>
                  <div className="points-amount">2,500</div>
                  <p>Points expire on Dec 31, 2024</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
