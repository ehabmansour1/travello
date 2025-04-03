import React, { useState, useEffect } from 'react';
import './ManageTours.css';

// بيانات عينة للجولات
const sampleTours = [
  {
    id: 1,
    title: 'Majestic Switzerland',
    image: 'https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b',
    category: 'mountain',
    price: 2499,
    duration: '7 days',
    maxGroupSize: 15,
    difficulty: 'moderate',
    status: 'active',
    bookings: 24,
    rating: 4.9,
    description: 'Experience the breathtaking beauty of Switzerland on this 7-day adventure through the heart of the Alps.',
    dates: [
      { date: '2024-06-15', price: 2499, spotsLeft: 8 },
      { date: '2024-07-01', price: 2699, spotsLeft: 12 }
    ]
  },
  // يمكنك إضافة المزيد من الجولات هنا
];

const ManageTours = () => {
  const [tours] = useState(sampleTours);
  const [filteredTours, setFilteredTours] = useState(sampleTours);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // تصفية الجولات عند تغيير معطيات البحث أو الفلاتر
  useEffect(() => {
    filterTours();
  }, [searchTerm, categoryFilter, statusFilter, tours]);

  const filterTours = () => {
    const filtered = tours.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || tour.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredTours(filtered);
  };

  const handleAddTourModal = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  return (
    <section id="tours" className="admin-tab active">
      <div className="tours-header">
        <h2>Tour Management</h2>
        <button className="btn-primary" onClick={handleAddTourModal}>
          <i className="fas fa-plus"></i> Add New Tour
        </button>
      </div>

      <div className="tours-filters">
        <div className="search-group">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input" 
            placeholder="Search tours by name or destination..."
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="adventure">Adventure</option>
          <option value="cultural">Cultural</option>
          <option value="beach">Beach</option>
          <option value="mountain">Mountain</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="tours-grid">
        {filteredTours.map(tour => (
          <div key={tour.id} className="tour-card">
            <div
              className="tour-image"
              style={{ backgroundImage: `url(${tour.image})` }}
            >
              <div className={`tour-badge ${tour.status}`}>{tour.status}</div>
            </div>
            <div className="tour-content">
              <h3>{tour.title}</h3>
              <p>{tour.description.substring(0, 100)}...</p>
              <div className="tour-meta">
                <div className="tour-price">${tour.price}</div>
                <div className="tour-stats">
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <span>{tour.bookings} bookings</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <span>{tour.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tour-actions">
              <button className="btn-secondary btn-sm" onClick={() => { /* Add edit functionality */ }}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn-secondary btn-sm" onClick={() => { /* Show availability functionality */ }}>
                <i className="fas fa-calendar"></i> Dates
              </button>
              <button className="btn-danger btn-sm" onClick={() => { /* Delete tour functionality */ }}>
                <i className="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal لإضافة جولة جديدة */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content tour-modal">
            <h2>Add New Tour</h2>
            <form
              id="addTourForm"
              onSubmit={(e) => {
                e.preventDefault();
                // من هنا يمكن إضافة منطق إنشاء الجولة
                alert('Tour created successfully!');
                handleCloseModal();
              }}
            >
              <div className="tour-form-grid">
                <div className="form-group">
                  <label>Tour Title</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" required>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (USD)</label>
                  <input type="number" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Duration (days)</label>
                  <input type="number" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Max Group Size</label>
                  <input type="number" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select className="form-input" required>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea className="form-input" rows="4" required></textarea>
                </div>
              </div>

              <h3>Tour Images</h3>
              <div className="image-upload-grid">
                <div className="image-upload-item">
                  <i className="fas fa-plus"></i>
                </div>
                {/* المزيد من مربعات رفع الصور */}
              </div>

              <h3>Itinerary</h3>
              <div className="itinerary-builder">
                <div className="itinerary-day">
                  <div className="itinerary-day-header">
                    <h4>Day 1</h4>
                    <button type="button" className="btn-secondary btn-sm">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-input" rows="2" required></textarea>
                  </div>
                </div>
                <button type="button" className="btn-secondary">
                  <i className="fas fa-plus"></i> Add Day
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageTours;
