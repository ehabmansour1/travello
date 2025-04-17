import React, { useState, useEffect, useMemo } from "react";
import "./ManageTours.css";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const tourValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  location: Yup.string().required("Location is required"),
  rating: Yup.number().required("Rating is required").min(1).max(5),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  duration: Yup.number()
    .required("Duration is required")
    .positive("Duration must be positive")
    .integer("Duration must be a whole number"),
  maxGroupSize: Yup.number()
    .required("Max group size is required")
    .positive("Group size must be positive")
    .integer("Group size must be a whole number"),
  difficulty: Yup.string().required("Difficulty is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  status: Yup.string().required("Status is required"),
});

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
    location: "",
    rating: "5",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch tours from Firestore
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, "tours");
        const tourSnapshot = await getDocs(toursCollection);
        const tourList = tourSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
    const filterTours = () => {
      const filtered = tours.filter((tour) => {
        const matchesSearch = tour.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || tour.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || tour.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      });
      setFilteredTours(filtered);
    };

    filterTours();
  }, [searchTerm, categoryFilter, statusFilter, tours]);

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
      location: "",
      rating: "5",
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
      location: tour.location || "",
      rating: tour.rating || "5",
    });
    setShowAddModal(true);
  };

  const handleDeleteTour = async (tourId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tours", tourId));
        setTours(tours.filter((tour) => tour.id !== tourId));
        Swal.fire("Deleted!", "Tour has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting tour:", error);
        Swal.fire("Error!", "Failed to delete tour.", "error");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please upload a valid image file (JPEG, PNG, or JPG)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: "Please upload an image smaller than 5MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!values.image) {
        Swal.fire({
          icon: "error",
          title: "Missing Image",
          text: "Please upload a tour image",
        });
        return;
      }

      if (editingTour) {
        const tourRef = doc(db, "tours", editingTour.id);
        await updateDoc(tourRef, {
          ...values,
          price: Number(values.price),
          maxGroupSize: Number(values.maxGroupSize),
          duration: Number(values.duration),
          bookings: editingTour.bookings || 0,
          rating: Number(values.rating),
        });

        setTours(
          tours.map((tour) =>
            tour.id === editingTour.id
              ? {
                  ...tour,
                  ...values,
                  rating: Number(values.rating),
                }
              : tour
          )
        );

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Tour updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const toursCollection = collection(db, "tours");
        const docRef = await addDoc(toursCollection, {
          ...values,
          price: Number(values.price),
          maxGroupSize: Number(values.maxGroupSize),
          duration: Number(values.duration),
          bookings: 0,
          rating: Number(values.rating),
          dates: [],
        });

        const newTour = {
          id: docRef.id,
          ...values,
          bookings: 0,
          rating: Number(values.rating),
          dates: [],
        };

        setTours([...tours, newTour]);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "New tour added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      handleCloseModal();
      resetForm();
    } catch (error) {
      console.error("Error saving tour:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save tour. Please try again.",
      });
    } finally {
      setSubmitting(false);
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
      location: "",
      rating: "5",
    });
  };

  // Add pagination calculations
  const paginatedTours = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTours.slice(startIndex, endIndex);
  }, [filteredTours, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredTours.length / itemsPerPage)
  , [filteredTours.length, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

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
        {paginatedTours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <div
              className="tour-image"
              style={{ backgroundImage: `url(${tour.image})` }}
            >
              <div className={`tour-badge ${tour.status}`}>{tour.status}</div>
            </div>
            <div className="tour-content">
              <h3>{tour.title}</h3>
              <p className="tour-location">
                <i className="fas fa-map-marker-alt"></i> {tour.location}
              </p>
              <div className="tour-rating">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star ${
                      index < (tour.rating || 0) ? "active" : ""
                    }`}
                  ></i>
                ))}
                <span className="rating-text">({tour.rating || 0}/5)</span>
              </div>
              <p>{tour.description?.substring(0, 100)}...</p>
              <div className="tour-meta">
                <div className="tour-price">${tour.price}</div>
                <div className="tour-stats">
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <span>{tour.bookings || 0} bookings</span>
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
                className="btn-danger btn-sm"
                onClick={() => handleDeleteTour(tour.id)}
              >
                <i className="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

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
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content tour-modal">
            <h2>{editingTour ? "Edit Tour" : "Add New Tour"}</h2>
            <Formik
              initialValues={formData}
              validationSchema={tourValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values }) => (
                <Form className="tour-form-grid">
                  <div className="form-group">
                    <label>Tour Title</label>
                    <Field
                      type="text"
                      name="title"
                      className="form-input"
                    />
                    <ErrorMessage name="title" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <Field
                      type="text"
                      name="location"
                      className="form-input"
                      placeholder="e.g., Paris, France"
                    />
                    <ErrorMessage name="location" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Rating</label>
                    <Field as="select" name="rating" className="form-input">
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </Field>
                    <ErrorMessage name="rating" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <Field as="select" name="category" className="form-input">
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                      <option value="beach">Beach</option>
                      <option value="mountain">Mountain</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Price (USD)</label>
                    <Field
                      type="number"
                      name="price"
                      className="form-input"
                    />
                    <ErrorMessage name="price" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Duration (days)</label>
                    <Field
                      type="number"
                      name="duration"
                      className="form-input"
                    />
                    <ErrorMessage name="duration" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Max Group Size</label>
                    <Field
                      type="number"
                      name="maxGroupSize"
                      className="form-input"
                    />
                    <ErrorMessage name="maxGroupSize" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <Field as="select" name="difficulty" className="form-input">
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="challenging">Challenging</option>
                    </Field>
                    <ErrorMessage name="difficulty" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Tour Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => handleImageUpload(e)}
                      className="form-input"
                    />
                    {values.image && (
                      <div className="image-preview">
                        <img src={values.image} alt="Tour preview" />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <Field as="select" name="status" className="form-input">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="error-message" />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      className="form-input"
                      rows="4"
                    />
                    <ErrorMessage name="description" component="div" className="error-message" />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {editingTour ? "Update Tour" : "Create Tour"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageTours;
