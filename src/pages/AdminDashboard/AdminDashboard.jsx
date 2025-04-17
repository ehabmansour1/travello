import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

import AdminOverview from "../../components/AdminOverview/AdminOverview";
import ManageBookings from "../../components/ManageBookings/ManageBookings";
import ManageUsers from "../../components/ManageUsers/ManageUsers";
import ManageTours from "../../components/ManageTours/ManageTours";
import ManageBlogs from "../../components/ManageBlogs/ManageBlogs";
import ManagePayments from "../../components/ManagePayments/ManagePayments";
import userPic from "../../assets/images/user.png";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "bookings":
        return <ManageBookings />;
      case "users":
        return <ManageUsers />;
      case "tours":
        return <ManageTours />;
      case "blogs":
        return <ManageBlogs />;
      case "payments":
        return <ManagePayments />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <div className="user-info">
              <img
                src= {userPic}
                alt="Profile"
                className="avatar"
              />
              <div className="user-details">
                <h3>Admin</h3>
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
              Manage Bookings
            </a>
            <a
              href="#users"
              className={activeTab === "users" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("users");
              }}
            >
              Manage Users
            </a>
            <a
              href="#tours"
              className={activeTab === "tours" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("tours");
              }}
            >
              Manage Tours
            </a>
            <a
              href="#blogs"
              className={activeTab === "blogs" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("blogs");
              }}
            >
              Manage Blogs
            </a>
            <a
              href="#payments"
              className={activeTab === "payments" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("payments");
              }}
            >
              Manage Payments
            </a>

            <Link to="/liveChat" className="admin-nav-link">
              Live Chat
            </Link>
          </nav>
        </aside>
        <main className="admin-main">{renderActiveTab()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
