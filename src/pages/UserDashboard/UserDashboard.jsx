import "./UserDashboard.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "../../contexts/FirebaseContext";
import { Link } from "react-router-dom";
import WishlistItem from "../../components/Wishlist/WishlistItem";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const wishlist = useSelector((state) => state.wishlist.items);
  const { user, getUserData } = useFirebase();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const upcomingTrips = [
    {
      id: 1,
      title: "Majestic Switzerland",
      image: "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b",
      date: "June 15, 2024",
      duration: "7 days",
      status: "Confirmed",
    },
    {
      id: 2,
      title: "Thailand Paradise",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
      date: "July 1, 2024",
      duration: "10 days",
      status: "Pending",
    },
  ];

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

  const bookings = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      trip: "Majestic Switzerland",
      amount: 2499,
      status: "Paid",
      documents: ["invoice", "itinerary", "voucher"],
    },
    {
      id: "INV-2024-002",
      date: "2024-02-01",
      trip: "Thailand Paradise",
      amount: 1899,
      status: "Pending",
      documents: ["invoice"],
    },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const downloadDocument = (type, id) => {
    alert(`Downloading ${type} for booking ${id}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      // Check if timestamp is a Firestore Timestamp
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        const date = timestamp.toDate();
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // If it's a regular Date object or timestamp number
      if (timestamp instanceof Date || typeof timestamp === "number") {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // If it's a string date
      if (typeof timestamp === "string") {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/userProfile" className="user-info-link">
              <div className="user-info">
                <img
                  src={
                    userData?.photoURL ||
                    "https://tse4.mm.bing.net/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&rs=1&pid=ImgDetMain"
                  }
                  alt="Profile"
                  className="avatar"
                />
                <div className="user-details">
                  <h3>{userData?.name || "User"}</h3>
                  <p>From {formatDate(userData?.createdAt)}</p>
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
                <h1>Welcome back, {userData?.displayName || "User"}!</h1>
                <p>Here's what's happening with your travel plans</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <i className="fas fa-plane"></i>
                  <div className="stat-info">
                    <h3>3</h3>
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
                  {upcomingTrips.map((trip) => (
                    <div key={trip.id} className="trip-card">
                      <div
                        className="trip-image"
                        style={{ backgroundImage: `url(${trip.image})` }}
                      ></div>
                      <div className="trip-content">
                        <div className="trip-date">{trip.date}</div>
                        <h3>{trip.title}</h3>
                        <div className="trip-meta">
                          <span>
                            <i className="fas fa-clock"></i> {trip.duration}
                          </span>
                          <span>
                            <i className="fas fa-check-circle"></i>{" "}
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
              <div className="bookings-filters">
                <div className="filter-group">
                  <select className="filter-select">
                    <option value="all">All Bookings</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="search-group">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="search-input"
                  />
                </div>
              </div>
              <div className="bookings-grid">
                {bookings.map((booking, index) => (
                  <div key={index} className="booking-card">
                    <p>{booking.trip}</p>
                    {/* تفاصيل إضافية للحجز يمكن إضافتها هنا */}
                  </div>
                ))}
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
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Trip</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={index}>
                        <td>{booking.id}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>{booking.trip}</td>
                        <td>${booking.amount}</td>
                        <td>
                          <span
                            className={`status-badge ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {booking.documents.map((doc, docIndex) => (
                              <button
                                key={docIndex}
                                className="btn-secondary btn-sm"
                                onClick={() =>
                                  downloadDocument(doc, booking.id)
                                }
                              >
                                <i className="fas fa-download"></i>{" "}
                                {doc.charAt(0).toUpperCase() + doc.slice(1)}
                              </button>
                            ))}
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
