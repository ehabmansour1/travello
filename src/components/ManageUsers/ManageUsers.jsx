import React from 'react';
import './ManageUsers.css';

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

const ManageUsers = () => {
  return (
    <section id="users" className="admin-tab active">
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
    </section>
  );
};

export default ManageUsers;
