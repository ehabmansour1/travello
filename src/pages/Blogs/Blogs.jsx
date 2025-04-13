import React, { useState, useEffect } from "react";
import styles from "./Blogs.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogsCollection);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
      <div className={styles.background}>
        <div className={styles["blog-container"]}>
          <div className="loading">Loading blogs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <div className={styles["gradient-sphere"]}></div>
      <div className={`${styles["gradient-sphere"]} ${styles.secondary}`}></div>
      <div className={styles["blog-container"]}>
        <div className={styles["blog-header"]}>
          <h1>Travel Tips & Articles</h1>
          <p>Explore the world with useful travel tips and articles.</p>
        </div>

        <div className={styles["blog-list"]}>
          {blogs.map((blog) => (
            <div className={styles["blog-item"]} key={blog.id}>
              <div className={styles["blog-thumbnail"]}>
                <img src={blog.featuredImage} alt={blog.title} />
              </div>
              <div className={styles["blog-content"]}>
                <h2 className={styles["blog-title"]}>{blog.title}</h2>
                <p className={styles["blog-meta"]}>
                  <span className={styles.author}>By {blog.author.name}</span> |{" "}
                  <span className={styles.date}>
                    {blog.publishDate ? new Date(blog.publishDate.seconds * 1000).toLocaleDateString() : "Date not available"}
                  </span>
                </p>
                <p className={styles["blog-excerpt"]}>{blog.excerpt}</p>
                <div className={styles["blog-tags"]}>
                  {blog.tags?.map((tag, index) => (
                    <span key={index} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
                <Link to={`/blog/${blog.id}`} className={styles["read-more"]}>
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className={styles["no-blogs"]}>
            <p>No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
