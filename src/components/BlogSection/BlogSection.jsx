import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import "./BlogSection.css";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(
          blogsRef,
          orderBy("publishDate", "desc"),
          limit(3)
        );
        const blogSnapshot = await getDocs(q);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate() || new Date()
        }));
        setBlogs(blogList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="blog-section">
        <div className="section-header">
          <h2>Travel Stories</h2>
          <p>Get inspired by our latest travel tales</p>
        </div>
        <div className="loading">Loading blogs...</div>
      </section>
    );
  }

  return (
    <section className="blog-section">
      <div className="section-header">
        <h2>Travel Stories</h2>
        <p>Get inspired by our latest travel tales</p>
      </div>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div
              className="blog-image"
              style={{ backgroundImage: `url(${blog.featuredImage})` }}
            ></div>
            <div className="blog-content">
              <div className="blog-meta">
                <span className="author">{blog.author.name}</span>
                <span className="date">
                  {blog.publishDate.toLocaleDateString()}
                </span>
              </div>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <Link to={`/blogs/${blog.id}`} className="btn-secondary">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="view-all-blogs">
        <Link to="/blogs" className="btn-primary">
          View All Articles
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
