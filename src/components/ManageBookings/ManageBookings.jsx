import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';
import './ManageBookings.css';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchBookings = useCallback(async () => {
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
  }, []); // Empty dependency array since these dependencies don't change

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // Add fetchBookings to dependency array

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

  // Add pagination calculations
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredBookings.length / itemsPerPage)
  , [filteredBookings.length, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
              {paginatedBookings.map((booking) => (
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

          {filteredBookings.length > 0 && (
            <div className="table-pagination">
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
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {filteredBookings.length === 0 && (
            <div className="no-data">
              <p>No bookings found</p>
            </div>
          )}
      </div>
    </section>
  );
};

export default ManageBookings;
