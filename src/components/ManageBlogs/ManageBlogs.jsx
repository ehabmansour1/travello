import React, { useState, useEffect, useCallback } from 'react';
import './ManageBlogs.css';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

const ManageBlogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalContent, setModalContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'destinations',
    tags: [],
    featuredImage: '',
    status: 'published',
    author: {
      name: 'Admin',
      avatar: ''
    }
  });

  // Fetch blogs from Firestore
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsCollection = collection(db, 'blogs');
      const blogSnapshot = await getDocs(blogsCollection);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: doc.data().publishDate?.toDate?.() || new Date(),
        lastModified: doc.data().lastModified?.toDate?.() || new Date()
      }));
      setBlogPosts(blogList);
      setFilteredPosts(blogList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      Swal.fire('Error', 'Failed to fetch blog posts', 'error');
    }
  };

  const filterPosts = useCallback(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = blogPosts.filter(post => {
      const matchesSearch =
        post.title?.toLowerCase().includes(lowerSearch) ||
        post.excerpt?.toLowerCase().includes(lowerSearch);
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, categoryFilter, statusFilter, blogPosts]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const showCreatePostModal = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'destinations',
      tags: [],
      featuredImage: '',
      status: 'published',
      author: {
        name: 'Admin',
        avatar: ''
      }
    });
    setModalContent({ type: 'create' });
  };

  const closeModal = () => {
    setModalContent(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'destinations',
      tags: [],
      featuredImage: '',
      status: 'published',
      author: {
        name: 'Admin',
        avatar: ''
      }
    });
  };

  const editPost = (postId) => {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    setFormData({
      ...post,
      tags: post.tags || []
    });
    setModalContent({
      type: 'edit',
      post
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleBlogPostFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...formData,
        publishDate: new Date(),
        lastModified: new Date(),
        views: formData.views || 0,
        shares: formData.shares || 0,
        comments: formData.comments || 0
      };

      if (modalContent.type === 'edit' && modalContent.post.id) {
        // Update existing blog
        const blogRef = doc(db, 'blogs', modalContent.post.id);
        await updateDoc(blogRef, blogData);
        setBlogPosts(prev => 
          prev.map(post => 
            post.id === modalContent.post.id ? { ...blogData, id: post.id } : post
          )
        );
        Swal.fire('Success', 'Blog post updated successfully!', 'success');
      } else {
        // Create new blog
        const blogsCollection = collection(db, 'blogs');
        const docRef = await addDoc(blogsCollection, blogData);
        setBlogPosts(prev => [...prev, { ...blogData, id: docRef.id }]);
        Swal.fire('Success', 'Blog post created successfully!', 'success');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving blog post:', error);
      Swal.fire('Error', 'Failed to save blog post', 'error');
    }
  };

  const deletePost = async (postId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'blogs', postId));
        setBlogPosts(prev => prev.filter(post => post.id !== postId));
        Swal.fire('Deleted!', 'Blog post has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        Swal.fire('Error', 'Failed to delete blog post', 'error');
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
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="blog-post-card">
              <div
                className="post-image"
                style={{ backgroundImage: `url(${post.featuredImage})` }}
              >
                <div className={`post-status ${post.status}`}>{post.status}</div>
              </div>
              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <div className="author-info">
                    {post.author.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                    ) : (
                      <div className="author-avatar-placeholder">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <span>{post.author.name}</span>
                  </div>
                  <div className="post-stats">
                    <span title="Views"><i className="fas fa-eye"></i> {post.views || 0}</span>
                    <span title="Shares"><i className="fas fa-share-alt"></i> {post.shares || 0}</span>
                    <span title="Comments"><i className="fas fa-comment"></i> {post.comments || 0}</span>
                  </div>
                </div>
                <div className="post-tags">
                  {post.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                  {post.tags?.length > 3 && (
                    <span className="tag more-tags">+{post.tags.length - 3}</span>
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

      {modalContent && (
        <div className="modal">
          <div className="modal-content blog-editor">
            <h2>{modalContent.type === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}</h2>
            <form id="blogPostForm" onSubmit={handleBlogPostFormSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Title</label>
                  <input 
                    type="text" 
                    name="title"
                    className="form-input" 
                    value={formData.title}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group full-width">
                  <label>Excerpt</label>
                  <textarea 
                    name="excerpt"
                    className="form-input" 
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="destinations">Destinations</option>
                    <option value="tips">Travel Tips</option>
                    <option value="stories">Travel Stories</option>
                    <option value="guides">Travel Guides</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-input"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Featured Image URL</label>
                <input
                  type="url"
                  name="featuredImage"
                  className="form-input"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  required
                />
                {formData.featuredImage && (
                  <div className="image-preview">
                    <img src={formData.featuredImage} alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                      className="btn-danger btn-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  className="form-input content-editor"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add a tag and press Enter"
                    onKeyPress={handleTagInput}
                  />
                  <div className="tags-container">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {modalContent.type === 'create' ? 'Create Post' : 'Update Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
