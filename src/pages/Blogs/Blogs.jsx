import React from "react";
import styles from "./Blogs.module.css"; // استيراد CSS Module

const blogs = [
  {
    id: 1,
    title: "Discover Hidden Gems in Europe",
    author: "John Doe",
    date: "March 21, 2025",
    excerpt:
      "Europe is full of stunning destinations, but some gems are often overlooked. Let's uncover some secret spots...",
    image: "https://via.placeholder.com/300",
    link: "/blog/1",
  },
  {
    id: 2,
    title: "The Best Street Food in Asia",
    author: "Jane Smith",
    date: "March 15, 2025",
    excerpt:
      "Street food in Asia is a whole experience. From savory snacks to sweet treats, here are the best ones to try...",
    image: "https://via.placeholder.com/300",
    link: "/blog/2",
  },
  {
    id: 3,
    title: "Top 10 Beaches to Visit in 2025",
    author: "Emily Johnson",
    date: "March 10, 2025",
    excerpt:
      "Looking for the perfect beach getaway? Here are the top 10 beaches you should visit this year...",
    image: "https://via.placeholder.com/300",
    link: "/blog/3",
  },
  {
    id: 4,
    title: "Discover Hidden Gems in Europe",
    author: "John Doe",
    date: "March 21, 2025",
    excerpt:
      "Europe is full of stunning destinations, but some gems are often overlooked. Let's uncover some secret spots...",
    image: "https://via.placeholder.com/300",
    link: "/blog/1",
  },
  {
    id: 5,
    title: "The Best Street Food in Asia",
    author: "Jane Smith",
    date: "March 15, 2025",
    excerpt:
      "Street food in Asia is a whole experience. From savory snacks to sweet treats, here are the best ones to try...",
    image: "https://via.placeholder.com/300",
    link: "/blog/2",
  },
  {
    id: 6,
    title: "Top 10 Beaches to Visit in 2025",
    author: "Emily Johnson",
    date: "March 10, 2025",
    excerpt:
      "Looking for the perfect beach getaway? Here are the top 10 beaches you should visit this year...",
    image: "https://via.placeholder.com/300",
    link: "/blog/3",
  },
];

const Blogs = () => {
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
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className={styles["blog-content"]}>
                <h2 className={styles["blog-title"]}>{blog.title}</h2>
                <p className={styles["blog-meta"]}>
                  <span className={styles.author}>By {blog.author}</span> |{" "}
                  <span className={styles.date}>{blog.date}</span>
                </p>
                <p className={styles["blog-excerpt"]}>{blog.excerpt}</p>
                <a href={blog.link} className={styles["read-more"]}>
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
