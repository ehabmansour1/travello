import React, { useState, useEffect } from 'react';
import './ManageBlogs.css';

const sampleBlogPosts = [
  {
    id: 'blog-1',
    title: '10 Hidden Gems in Switzerland',
    slug: '10-hidden-gems-switzerland',
    excerpt: 'Discover the most breathtaking secret locations in the Swiss Alps...',
    content: `
      <h2>Introduction</h2>
      <p>Switzerland is known for its popular destinations like Zurich and Geneva, but there are many hidden treasures waiting to be discovered...</p>
      <h2>1. Lauterbrunnen Valley</h2>
      <p>This stunning valley features 72 waterfalls cascading from towering cliffs...</p>
    `,
    author: {
      id: 1,
      name: 'Sarah Wilson',
      avatar: ''
    },
    category: 'destinations',
    tags: ['switzerland', 'hidden-gems', 'europe', 'adventure'],
    featuredImage: 'https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b',
    status: 'published',
    publishDate: '2024-02-15T10:00:00',
    lastModified: '2024-02-15T10:00:00',
    views: 1205,
    shares: 43,
    comments: 12
  },
  // يمكن إضافة مزيد من المنشورات هنا...
];

const ManageBlogs = () => {
  // حالة المنشورات والفلترة
  const [blogPosts, setBlogPosts] = useState(sampleBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState(sampleBlogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalContent, setModalContent] = useState(null);

  // إعادة تصفية المنشورات عند تغيير المدخلات
  useEffect(() => {
    filterPosts();
  }, [searchTerm, categoryFilter, statusFilter, blogPosts]);

  const filterPosts = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = blogPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(lowerSearch) ||
        post.excerpt.toLowerCase().includes(lowerSearch);
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredPosts(filtered);
  };

  // إدارة فتح المودال لإنشاء منشور جديد
  const showCreatePostModal = () => {
    setModalContent({
      type: 'create'
    });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  // إجراءات تحرير، عرض معاينة وحذف منشور
  const editPost = (postId) => {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    // هنا يمكن إعادة استخدام مودال الإنشاء مع تعبئة الحقول الموجودة
    setModalContent({
      type: 'edit',
      post
    });
  };

  const previewPost = (postId) => {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    setModalContent({
      type: 'preview',
      post
    });
  };

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      // حذف المنشور من الحالة
      const updatedPosts = blogPosts.filter(post => post.id !== postId);
      setBlogPosts(updatedPosts);
      alert('Post deleted successfully!');
    }
  };

  // بعد إرسال النموذج يمكننا معالجته (على سبيل المثال: إنشاء منشور جديد أو تعديل منشور)
  const handleBlogPostFormSubmit = (e) => {
    e.preventDefault();
    // هنا يتم جمع بيانات النموذج ومعالجتها، وبالنسبة للمثال نغلق المودال
    alert('Blog post submitted!');
    closeModal();
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
                    <span title="Views"><i className="fas fa-eye"></i> {post.views}</span>
                    <span title="Shares"><i className="fas fa-share-alt"></i> {post.shares}</span>
                    <span title="Comments"><i className="fas fa-comment"></i> {post.comments}</span>
                  </div>
                </div>
                <div className="post-tags">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                  {post.tags.length > 3 && (
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
                  className="btn-secondary btn-sm" 
                  onClick={() => previewPost(post.id)}
                  title="Preview post"
                >
                  <i className="fas fa-eye"></i>
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
          {modalContent.type === 'create' || modalContent.type === 'edit' ? (
            <div className="modal-content blog-editor">
              <h2>{modalContent.type === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}</h2>
              <form id="blogPostForm" onSubmit={handleBlogPostFormSubmit}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Title</label>
                    <input type="text" className="form-input" required defaultValue={modalContent.post ? modalContent.post.title : ''} />
                  </div>

                </div>
                <div className="form-group">
                  <label>Featured Image</label>
                  <div className="image-upload-area">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop an image or click to upload</p>
                    <input type="file" accept="image/*" className="file-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <div className="rich-text-editor">
                    <div className="editor-toolbar">
                      <button type="button" data-command="bold"><i className="fas fa-bold"></i></button>
                      <button type="button" data-command="italic"><i className="fas fa-italic"></i></button>
                      <button type="button" data-command="h2">H2</button>
                      <button type="button" data-command="h3">H3</button>
                      <button type="button" data-command="link"><i className="fas fa-link"></i></button>
                      <button type="button" data-command="image"><i className="fas fa-image"></i></button>
                    </div>
                    <div className="editor-content" contentEditable="true">
                      {modalContent.post ? <div dangerouslySetInnerHTML={{ __html: modalContent.post.content }} /> : ''}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-input">
                    <input type="text" className="form-input" placeholder="Add a tag and press Enter" />
                    <div className="tags-container"></div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">Submit Post</button>
                </div>
              </form>
            </div>
          ) : modalContent.type === 'preview' ? (
            <div className="modal-content blog-preview">
              <h2>Post Preview</h2>
              <div className="preview-container">
                <img src={modalContent.post.featuredImage} alt={modalContent.post.title} className="preview-image" />
                <h1>{modalContent.post.title}</h1>
                <div className="preview-meta">
                  <span>{new Date(modalContent.post.publishDate).toLocaleDateString()}</span>
                  <span>By {modalContent.post.author.name}</span>
                </div>
                <div className="preview-content" dangerouslySetInnerHTML={{ __html: modalContent.post.content }} />
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
