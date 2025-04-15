import React from "react";
import styles from "./Hero.module.css";

const Hero = ({ searchData, handleSearchChange, handleSearchSubmit }) => {
  return (
    <section className={styles["hero-section"]}>
      <div className={styles["hero-content"]}>
        <h1>Discover Your Next Adventure</h1>
        <p>
          Explore breathtaking destinations and create unforgettable memories
        </p>

        <form className={styles["search-bar"]} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="destination"
            className={styles["search-input"]}
            placeholder="Where would you like to go?"
            value={searchData.destination}
            onChange={handleSearchChange}
          />
          <input
            type="number"
            name="price"
            className={styles["search-input"]}
            placeholder="Budget limit"
            value={searchData.price}
            onChange={handleSearchChange}
            min="0"
          />
          <select
            name="category"
            className={styles["search-input"]}
            value={searchData.category}
            onChange={handleSearchChange}
          >
            <option value="all">All Categories</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="beach">Beach</option>
            <option value="mountain">Mountain</option>
          </select>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
