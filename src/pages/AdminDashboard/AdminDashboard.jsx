import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');


  
  // مراجع لعناصر الـ canvas للمخططات
  const revenueChartRef = useRef(null);
  const bookingsChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const bookingsChartInstance = useRef(null);

  // بيانات عينة للمخططات
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [30000, 45000, 35000, 50000, 42000, 55000],
      borderColor: '#ff3366',
      backgroundColor: 'rgba(255, 51, 102, 0.1)',
      fill: true
    }]
  };

  const bookingsData = {
    labels: ['Swiss Alps', 'Thailand', 'Italy', 'Greece', 'Japan'],
    datasets: [{
      label: 'Bookings',
      data: [65, 45, 35, 28, 25],
      backgroundColor: [
        'rgba(255, 51, 102, 0.8)',
        'rgba(255, 153, 51, 0.8)',
        'rgba(51, 255, 153, 0.8)',
        'rgba(51, 153, 255, 0.8)',
        'rgba(153, 51, 255, 0.8)'
      ]
    }]
  };

  // Add sample bookings data
  const sampleBookingsData = [
    {
      id: 'BK-2024-001',
      customer: 'John Smith',
      tour: 'Swiss Alps Tour',
      date: '2024-03-15',
      amount: 2499,
      status: 'Confirmed'
    },
    {
      id: 'BK-2024-002',
      customer: 'Sarah Wilson',
      tour: 'Thailand Paradise',
      date: '2024-04-01',
      amount: 1899,
      status: 'Pending'
    },
    {
      id: 'BK-2024-003',
      customer: 'Mike Johnson',
      tour: 'Greece Islands',
      date: '2024-05-10',
      amount: 2199,
      status: 'Confirmed'
    }
  ];

  // Add sample users data
  const sampleUsersData = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      role: 'Customer',
      status: 'Active',
      joined: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'Customer',
      status: 'Active',
      joined: '2024-02-01'
    }
  ];

  useEffect(() => {
    // Cleanup function to destroy previous charts
    const cleanup = () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (bookingsChartInstance.current) {
        bookingsChartInstance.current.destroy();
      }
    };

    // Initialize charts
    if (revenueChartRef.current) {
      cleanup();
      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: 'line',
        data: revenueData,
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
          }
        }
      });
    }

    if (bookingsChartRef.current) {
      bookingsChartInstance.current = new Chart(bookingsChartRef.current, {
        type: 'bar',
        data: bookingsData,
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
          }
        }
      });
    }

    // Cleanup when component unmounts
    return cleanup;
  }, []);

  // دالة تغيير التاب
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // إضافة تمرير تلقائي للمحتوى
    document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="admin-dashboard">

      <div className="admin-container">
        <div className="admin-sidebar">
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
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('overview');
              }}
            >
              
              Overview
            </a>
            <a
              href="#bookings"
              className={activeTab === 'bookings' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('bookings');
              }}
            >
              
              Bookings
            </a>
            <a
              href="#users"
              className={activeTab === 'users' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('users');
              }}
            >
             
              Users
            </a>
          </nav>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="admin-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="admin-tab active" id="overview">
              <div className="admin-header">
                <h1>Dashboard Overview</h1>
                <div className="date-filter">
                  <select className="filter-select">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month" selected>This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <div className="stat-value">$124,563</div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i> 12.5%
                    </div>
                  </div>
                </div>

                <div className="stat-card success">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <div className="stat-value">1,234</div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i> 8.3%
                    </div>
                  </div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Total Bookings</h3>
                    <div className="stat-value">856</div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i> 5.2%
                    </div>
                  </div>
                </div>

                <div className="stat-card info">
                  <div className="stat-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Average Rating</h3>
                    <div className="stat-value">4.8</div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i> 2.1%
                    </div>
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Revenue Overview</h3>
                  <canvas id="revenueChart" ref={revenueChartRef}></canvas>
                </div>
                <div className="chart-card">
                  <h3>Bookings by Tour</h3>
                  <canvas id="bookingsChart" ref={bookingsChartRef}></canvas>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {/* يمكن تعبئة بيانات النشاطات هنا عبر جافاسكريبت أو من خلال state */}
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>John Doe</strong> - New booking: Swiss Alps Tour
                      </div>
                      <div className="activity-time">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-credit-card"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>Sarah Smith</strong> - Payment received: $2,499
                      </div>
                      <div className="activity-time">15 minutes ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>Mike Wilson</strong> - New user registration
                      </div>
                      <div className="activity-time">1 hour ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* باقي التابات يمكن إضافتها بنفس الطريقة */}
          {activeTab === 'bookings' && (
            <div className="admin-tab active" id="bookings">
              {/* محتوى إدارة الحجوزات */}
              <div className="admin-header">
                <h2>Manage Bookings</h2>
              </div>
              
              <div className="header-actions">
                <div className="search-filters">
                  <input 
                    type="text" 
                    placeholder="Search by ID, customer name or email..." 
                    className="search-input" 
                  />
                  <select className="filter-select">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select className="filter-select">
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <button className="btn-secondary">
                    <i className="fas fa-download"></i> Export CSV
                  </button>
                </div>
              </div>
              
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Tour</th>
                      <th>Details</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleBookingsData.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.customer}</td>
                        <td>{booking.tour}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>${booking.amount}</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-secondary btn-sm">
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button className="btn-danger btn-sm">
                              <i className="fas fa-trash"></i> Remove
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

          {/* يمكن إضافة باقي التابات (payments, users, tours, blog, analytics) بنفس النهج */}
          
          {activeTab === 'users' && (
            <div className="admin-tab active" id="users">
              <div className="admin-header">
                <h2>User Management</h2>
                <div className="header-actions">
                  <div className="search-filters">
                    <input type="text" placeholder="Search users..." className="search-input" />
                    <select className="filter-select">
                      <option value="all">All Users</option>
                      <option value="customers">Customers</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <button className="btn-primary">
                    <i className="fas fa-plus"></i> Add User
                  </button>
                </div>
              </div>
              
              <div className="users-grid">
                {sampleUsersData.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-card-header">
                      <img src="" alt={user.name} className="user-avatar" />
                      <span className={`user-status ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="user-card-content">
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                      <div className="user-meta">
                        <span className={`user-role ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                        <span className="user-joined">
                          Joined {new Date(user.joined).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="user-actions">
                      <button className="btn-secondary btn-sm">
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="btn-danger btn-sm">
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        
         
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
