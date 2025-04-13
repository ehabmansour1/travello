import React, { useState, useEffect } from "react";
import "./ManageTours.css";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from 'sweetalert2';

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "adventure",
    price: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "easy",
    description: "",
    image: "",
    status: "active",
  });

  // Fetch tours from Firestore
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, "tours");
        const tourSnapshot = await getDocs(toursCollection);
        const tourList = tourSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTours(tourList);
        setFilteredTours(tourList);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAddModal]);

  useEffect(() => {
    filterTours();
  }, [searchTerm, categoryFilter, statusFilter, tours]);

  const filterTours = () => {
    const filtered = tours.filter((tour) => {
      const matchesSearch = tour.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || tour.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || tour.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredTours(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTourModal = () => {
    setEditingTour(null);
    setFormData({
      title: "",
      category: "adventure",
      price: "",
      duration: "",
      maxGroupSize: "",
      difficulty: "easy",
      description: "",
      image: "",
      status: "active",
    });
    setShowAddModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      category: tour.category,
      price: tour.price,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize,
      difficulty: tour.difficulty,
      description: tour.description,
      image: tour.image,
      status: tour.status,
    });
    setShowAddModal(true);
  };

  const handleDeleteTour = async (tourId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tours", tourId));
        setTours(tours.filter(tour => tour.id !== tourId));
        Swal.fire(
          'Deleted!',
          'Tour has been deleted.',
          'success'
        );
      } catch (error) {
        console.error("Error deleting tour:", error);
        Swal.fire(
          'Error!',
          'Failed to delete tour.',
          'error'
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTour) {
        // Update existing tour
        const tourRef = doc(db, "tours", editingTour.id);
        await updateDoc(tourRef, {
          ...formData,
          price: Number(formData.price),
          maxGroupSize: Number(formData.maxGroupSize),
          duration: Number(formData.duration),
          bookings: editingTour.bookings || 0,
          rating: editingTour.rating || 0,
        });

        setTours(tours.map(tour => 
          tour.id === editingTour.id ? { ...tour, ...formData } : tour
        ));

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Tour updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Add new tour
        const toursCollection = collection(db, "tours");
        const docRef = await addDoc(toursCollection, {
          ...formData,
          price: Number(formData.price),
          maxGroupSize: Number(formData.maxGroupSize),
          duration: Number(formData.duration),
          bookings: 0,
          rating: 0,
          dates: [],
        });

        const newTour = {
          id: docRef.id,
          ...formData,
          bookings: 0,
          rating: 0,
          dates: [],
        };

        setTours([...tours, newTour]);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'New tour added successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving tour:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save tour. Please try again.',
      });
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTour(null);
    setFormData({
      title: "",
      category: "adventure",
      price: "",
      duration: "",
      maxGroupSize: "",
      difficulty: "easy",
      description: "",
      image: "",
      status: "active",
    });
  };

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
        {filteredTours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <div
              className="tour-image"
              style={{ backgroundImage: `url(${tour.image})` }}
            >
              <div className={`tour-badge ${tour.status}`}>{tour.status}</div>
            </div>
            <div className="tour-content">
              <h3>{tour.title}</h3>
              <p>{tour.description?.substring(0, 100)}...</p>
              <div className="tour-meta">
                <div className="tour-price">${tour.price}</div>
                <div className="tour-stats">
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <span>{tour.bookings || 0} bookings</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <span>{tour.rating || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tour-actions">
              <button
                className="btn-secondary btn-sm"
                onClick={() => handleEditTour(tour)}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
              <button
                className="btn-secondary btn-sm"
                onClick={() => {/* Show availability functionality */}}
              >
                <i className="fas fa-calendar"></i> Dates
              </button>
              <button
                className="btn-danger btn-sm"
                onClick={() => handleDeleteTour(tour.id)}
              >
                <i className="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content tour-modal">
            <h2>{editingTour ? 'Edit Tour' : 'Add New Tour'}</h2>
            <form id="addTourForm" onSubmit={handleSubmit}>
              <div className="tour-form-grid">
                <div className="form-group">
                  <label>Tour Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input" 
                    required
                  >
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (USD)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Duration (days)</label>
                  <input 
                    type="number" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="form-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Max Group Size</label>
                  <input 
                    type="number" 
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleInputChange}
                    className="form-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select 
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="form-input" 
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input 
                    type="url" 
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="form-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-input" 
                    required
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input" 
                    rows="4" 
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTour ? 'Update Tour' : 'Create Tour'}
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
