import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './BlogDetails.module.css';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRef = doc(db, 'blogs', id);
        const blogSnap = await getDoc(blogRef);
        
        if (blogSnap.exists()) {
          setBlog({
            id: blogSnap.id,
            ...blogSnap.data(),
            publishDate: blogSnap.data().publishDate?.toDate() || new Date()
          });
        } else {
          console.log('No such blog!');
          navigate('/blogs');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setLoading(false);
        navigate('/blogs');
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={styles.detailsContainer}>
        <div className="loading">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.error}>Blog not found</div>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h1>{blog.title}</h1>
        <p>By {blog.author.name} | {blog.publishDate.toLocaleDateString()}</p>
        <div className={styles.tags}>
          {blog.tags?.map((tag, index) => (
            <span key={index} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>
      
      <img
        src={blog.featuredImage}
        alt={blog.title}
        className={styles.image}
      />

      <div className={styles.content}>
        <p className={styles.excerpt}>{blog.excerpt}</p>
        {blog.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <button className={styles.backButton} onClick={() => navigate('/blogs')}>
        <i className="fas fa-arrow-left"></i> Back to Articles
      </button>
    </div>
  );
};

export default BlogDetails;
