import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';
import './ManageBookings.css';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCollection);
      const bookingsList = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setBookings(bookingsList);
      setFilteredBookings(bookingsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const filterBookings = useCallback(() => {
    let filtered = [...bookings];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.tourTitle?.toLowerCase().includes(searchLower) ||
        booking.travelerInfo?.firstName?.toLowerCase().includes(searchLower) ||
        booking.travelerInfo?.lastName?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus
      });

      // Update local state
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);

      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Booking has been ${newStatus.toLowerCase()}.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update booking status.',
      });
    }
  };

  return (
    <section id="bookings" className="admin-tab active">
      <div className="admin-header">
        <h2>Manage Bookings</h2>
      </div>
      <div className="header-actions">
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search by tour name or customer..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        
        </div>
      </div>
      <div className="bookings-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id.slice(0, 8)}</td>
                  <td>
                    {booking.travelerInfo?.firstName} {booking.travelerInfo?.lastName}
                    <div className="customer-contact">
                      <small>{booking.travelerInfo?.phone}</small>
                    </div>
                  </td>
                  <td>{booking.tourTitle}</td>
                  <td>
                    <div>Date: {booking.date.toLocaleDateString()}</div>
                    <div>Travelers: {booking.numTravelers}</div>
                    {booking.specialRequests && (
                      <div className="special-requests">
                        <small>Note: {booking.specialRequests}</small>
                      </div>
                    )}
                  </td>
                  <td>${booking.totalPrice}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {booking.status === 'pending' && (
                        <button 
                          className="btn-success btn-sm"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          <i className="fas fa-check"></i> Confirm
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button 
                          className="btn-danger btn-sm"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ManageBookings;
