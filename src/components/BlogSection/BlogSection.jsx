import React from "react";
import { Link } from "react-router-dom";
import "./BlogSection.css";

const BlogSection = ({ blogPosts }) => {
  return (
    <section className="blog-section">
      <div className="section-header">
        <h2>Travel Stories</h2>
        <p>Get inspired by our latest travel tales</p>
      </div>

      <div className="blog-grid">
        {blogPosts.map((post) => (
          <div key={post.id} className="blog-card">
            <div
              className="blog-image"
              style={{ backgroundImage: `url(${post.image})` }}
            ></div>
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="btn-secondary">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
