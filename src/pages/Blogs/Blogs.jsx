import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import styles from "./Blogs.module.css";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogsCollection);
        const blogList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate?.() || new Date(),
        }));
        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        Swal.fire("Error", "Failed to fetch blog posts", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // Pagination calculations
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBlogs.slice(startIndex, endIndex);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredBlogs.length / itemsPerPage)
  , [filteredBlogs.length, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogsHeader}>
        <h1>Travel Blog</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.blogsGrid}>
        {paginatedBlogs.map((blog) => (
          <div key={blog.id} className={styles.blogCard}>
            <div 
              className={styles.blogImage} 
              style={{ backgroundImage: `url(${blog.featuredImage})` }}
            />
            <div className={styles.blogContent}>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div className={styles.blogMeta}>
                <div className={styles.authorInfo}>
                  {blog.author.avatar ? (
                    <img 
                      src={blog.author.avatar} 
                      alt={blog.author.name} 
                      className={styles.authorAvatar}
                    />
                  ) : (
                    <div className={styles.authorAvatarPlaceholder}>
                      {blog.author.name.charAt(0)}
                    </div>
                  )}
                  <span>{blog.author.name}</span>
                </div>
                <div className={styles.blogDate}>
                  {blog.publishDate.toLocaleDateString()}
                </div>
              </div>
              <div className={styles.blogTags}>
                {blog.tags?.map((tag, index) => (
                  <span key={index} className={styles.tag}>#{tag}</span>
                ))}
              </div>
              <Link to={`/blogs/${blog.id}`} className={styles["read-more"]}>
                  Read More
                </Link>
            </div>
            
          </div>
          
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className={styles.noResults}>
          <h3>No blog posts found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {filteredBlogs.length > 0 && (
        <div className={styles.pagination}>
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
              className={currentPage === index + 1 ? styles.active : ''}
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

          <div className={styles.itemsPerPage}>
            <span>Items per page:</span>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
