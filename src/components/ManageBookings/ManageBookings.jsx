import React from 'react';
import './ManageBookings.css';

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

const ManageBookings = () => {
  return (
    <section id="bookings" className="admin-tab active">
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
    </section>
  );
};

export default ManageBookings;
