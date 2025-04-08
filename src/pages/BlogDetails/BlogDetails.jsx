import React from 'react';
import styles from './ArticleDetails.module.css';

const BlogsDetails = () => {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h1>Exploring the Hidden Gems of Egypt 🏜️</h1>
        <p>By Mahmoud Makady | April 8, 2025</p>
      </div>
      
      <img
        src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90"
        alt="Egyptian Desert"
        className={styles.image}
      />

      <div className={styles.content}>
        <p>
          Egypt is not just about the pyramids and the Nile. There are countless hidden gems across the country waiting to be explored.
          From the serene oases in the Western Desert to the stunning beaches of the Red Sea, Egypt has a lot to offer adventurous travelers.
        </p>
        <p>
          Dive into the rich history of Alexandria, hike the trails of Sinai, or relax in the tranquil setting of Siwa Oasis. 
          Each destination offers a unique experience that blends natural beauty with cultural heritage.
        </p>
        <p>
          Don't forget to try local cuisines, engage with local communities, and capture the breathtaking landscapes through your lens!
        </p>
      </div>

      <button className={styles.backButton} onClick={() => window.history.back()}>
        🔙 Back to Articles
      </button>
    </div>
  );
};

export default BlogsDetails;
