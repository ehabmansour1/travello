import React, { useState } from 'react';
import './AdminDashboard.css';

import AdminOverview from '../../components/AdminOverview/AdminOverview';
import ManageBookings from '../../components/ManageBookings/ManageBookings';
import ManageUsers from '../../components/ManageUsers/ManageUsers';
import ManageTours from '../../components/ManageTours/ManageTours';
import ManageBlogs from '../../components/ManageBlogs/ManageBlogs';
import ManagePayments from '../../components/ManagePayments/ManagePayments';
import Analytics from '../../components/Analytics/Analytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tours'); // تغيير القيمة الافتراضية إلى 'tours'

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <div className="user-info">
              <img src="https://tse4.mm.bing.net/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&rs=1&pid=ImgDetMain" alt="Profile" className="avatar" />
              <div className="user-details">
                <h3>John Doe</h3>
                <p>Member since 2025</p>
              </div>
            </div>
            <a
              href="#overview"
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('overview'); }}
            >
              Overview
            </a>
            <a
              href="#bookings"
              className={activeTab === 'bookings' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('bookings'); }}
            >
              Manage Bookings
            </a>
            <a
              href="#users"
              className={activeTab === 'users' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('users'); }}
            >
              Manage Users
            </a>
            <a
              href="#tours"
              className={activeTab === 'tours' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('tours'); }}
            >
              Manage Tours
            </a>
            <a
              href="#blogs"
              className={activeTab === 'blogs' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('blogs'); }}
            >
              Manage Blogs
            </a>
            <a
              href="#payments"
              className={activeTab === 'payments' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('payments'); }}
            >
              Manage Payments
            </a>
            <a
              href="#analytics"
              className={activeTab === 'analytics' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleTabClick('analytics'); }}
            >
              Analytics & Reports
            </a>
          </nav>
        </aside>
        <main className="admin-main">
          <div className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}>
            {activeTab === 'overview' && <AdminOverview />}
          </div>
          <div className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}>
            {activeTab === 'bookings' && <ManageBookings />}
          </div>
          <div className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}>
            {activeTab === 'users' && <ManageUsers />}
          </div>
          <div className={`admin-tab ${activeTab === 'tours' ? 'active' : ''}`}>
            {activeTab === 'tours' && <ManageTours />}
          </div>
          <div className={`admin-tab ${activeTab === 'blogs' ? 'active' : ''}`}>
            {activeTab === 'blogs' && <ManageBlogs />}
          </div>
          <div className={`admin-tab ${activeTab === 'payments' ? 'active' : ''}`}>
            {activeTab === 'payments' && <ManagePayments />}
          </div>
          <div className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}>
            {activeTab === 'analytics' && <Analytics />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
