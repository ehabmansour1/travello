import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./ManageBlogs.css";
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

const blogValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  excerpt: Yup.string()
    .required("Excerpt is required")
    .min(10, "Excerpt must be at least 10 characters"),
  content: Yup.string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters"),
  category: Yup.string().required("Category is required"),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, "At least one tag is required"),
  status: Yup.string().required("Status is required"),
});

const ManageBlogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalContent, setModalContent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "destinations",
    tags: [],
    featuredImage: "",
    status: "published",
    author: {
      name: "Admin",
      avatar: "",
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch blogs from Firestore
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsCollection = collection(db, "blogs");
      const blogSnapshot = await getDocs(blogsCollection);
      const blogList = blogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate?.toDate?.() || new Date(),
        lastModified: doc.data().lastModified?.toDate?.() || new Date(),
      }));
      setBlogPosts(blogList);
      setFilteredPosts(blogList);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      Swal.fire("Error", "Failed to fetch blog posts", "error");
    }
  };

  const filterPosts = useCallback(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = blogPosts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(lowerSearch) ||
        post.excerpt?.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, categoryFilter, statusFilter, blogPosts]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredPosts.length / itemsPerPage)
  , [filteredPosts.length, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  const showCreatePostModal = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "destinations",
      tags: [],
      featuredImage: "",
      status: "published",
      author: {
        name: "Admin",
        avatar: "",
      },
    });
    setModalContent({ type: "create" });
  };

  const closeModal = () => {
    setModalContent(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "destinations",
      tags: [],
      featuredImage: "",
      status: "published",
      author: {
        name: "Admin",
        avatar: "",
      },
    });
  };

  const editPost = (postId) => {
    const post = blogPosts.find((p) => p.id === postId);
    if (!post) return;
    setFormData({
      ...post,
      tags: post.tags || [],
    });
    setModalContent({
      type: "edit",
      post,
    });
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
      setFormData((prev) => ({ ...prev, featuredImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleBlogPostFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!values.featuredImage) {
        Swal.fire({
          icon: "error",
          title: "Missing Image",
          text: "Please upload a featured image",
        });
        return;
      }

      const blogData = {
        ...values,
        publishDate: new Date(),
        lastModified: new Date(),
        views: values.views || 0,
        shares: values.shares || 0,
        comments: values.comments || 0,
      };

      if (modalContent.type === "edit" && modalContent.post.id) {
        const blogRef = doc(db, "blogs", modalContent.post.id);
        await updateDoc(blogRef, blogData);
        setBlogPosts((prev) =>
          prev.map((post) =>
            post.id === modalContent.post.id
              ? { ...blogData, id: post.id }
              : post
          )
        );
        Swal.fire("Success", "Blog post updated successfully!", "success");
      } else {
        const blogsCollection = collection(db, "blogs");
        const docRef = await addDoc(blogsCollection, blogData);
        setBlogPosts((prev) => [...prev, { ...blogData, id: docRef.id }]);
        Swal.fire("Success", "Blog post created successfully!", "success");
      }

      closeModal();
      resetForm();
    } catch (error) {
      console.error("Error saving blog post:", error);
      Swal.fire("Error", "Failed to save blog post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "blogs", postId));
        setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
        Swal.fire("Deleted!", "Blog post has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting blog post:", error);
        Swal.fire("Error", "Failed to delete blog post", "error");
      }
    }
  };

  return (
    <div className="admin-tab active" data-tab="blogs">
      <div className="blog-management-header">
        <div className="header-title">
          <h2>Manage Blog Posts</h2>
          <p>Create and manage your travel blog content</p>
        </div>
        <button className="btn-primary" onClick={showCreatePostModal}>
          <i className="fas fa-plus"></i> New Blog Post
        </button>
      </div>

      <div className="blog-filters">
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="destinations">Destinations</option>
          <option value="tips">Travel Tips</option>
          <option value="stories">Travel Stories</option>
          <option value="guides">Travel Guides</option>
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="blog-posts-grid">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <div key={post.id} className="blog-post-card">
              <div
                className="post-image"
                style={{ backgroundImage: `url(${post.featuredImage})` }}
              >
                <div className={`post-status ${post.status}`}>
                  {post.status}
                </div>
              </div>
              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <div className="author-info">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="author-avatar"
                      />
                    ) : (
                      <div className="author-avatar-placeholder">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <span>{post.author.name}</span>
                  </div>
                  <div className="post-stats">
                    <span title="Views">
                      <i className="fas fa-eye"></i> {post.views || 0}
                    </span>
                    <span title="Shares">
                      <i className="fas fa-share-alt"></i> {post.shares || 0}
                    </span>
                    <span title="Comments">
                      <i className="fas fa-comment"></i> {post.comments || 0}
                    </span>
                  </div>
                </div>
                <div className="post-tags">
                  {post.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                  {post.tags?.length > 3 && (
                    <span className="tag more-tags">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="post-actions">
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => editPost(post.id)}
                  title="Edit post"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => deletePost(post.id)}
                  title="Delete post"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No blog posts found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
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

      {modalContent && (
        <div className="modal">
          <div className="modal-content blog-editor">
            <h2>
              {modalContent.type === "create"
                ? "Create New Blog Post"
                : "Edit Blog Post"}
            </h2>
            <Formik
              initialValues={formData}
              validationSchema={blogValidationSchema}
              onSubmit={handleBlogPostFormSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="form-grid">
                  <div className="form-group full-width">
                    <label>Title</label>
                    <Field
                      type="text"
                      name="title"
                      className="form-input"
                    />
                    <ErrorMessage name="title" component="div" className="error-message" />
                  </div>

                  <div className="form-group full-width">
                    <label>Excerpt</label>
                    <Field
                      as="textarea"
                      name="excerpt"
                      className="form-input"
                    />
                    <ErrorMessage name="excerpt" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <Field
                      as="select"
                      name="category"
                      className="form-input"
                    >
                      <option value="destinations">Destinations</option>
                      <option value="tips">Travel Tips</option>
                      <option value="stories">Travel Stories</option>
                      <option value="guides">Travel Guides</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="form-input"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Featured Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => {
                        handleImageUpload(e);
                      }}
                      className="form-input"
                    />
                    {values.featuredImage && (
                      <div className="image-preview">
                        <img src={values.featuredImage} alt="Preview" />
                        <button
                          type="button"
                          onClick={() => setFieldValue("featuredImage", "")}
                          className="btn-danger btn-sm"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-input">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Add a tag and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            e.preventDefault();
                            const newTag = e.target.value.trim().toLowerCase();
                            if (!values.tags.includes(newTag)) {
                              setFieldValue("tags", [...values.tags, newTag]);
                            }
                            e.target.value = "";
                          }
                        }}
                      />
                      <div className="tags-container">
                        {values.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            #{tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = values.tags.filter((t) => t !== tag);
                                setFieldValue("tags", newTags);
                              }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <ErrorMessage name="tags" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label>Content</label>
                    <Field
                      as="textarea"
                      name="content"
                      className="form-input content-editor"
                      rows="10"
                    />
                    <ErrorMessage name="content" component="div" className="error-message" />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {modalContent.type === "create" ? "Create Post" : "Update Post"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
