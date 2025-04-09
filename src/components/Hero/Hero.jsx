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
            type="date"
            name="date"
            className={styles["search-input"]}
            value={searchData.date}
            onChange={handleSearchChange}
          />
          <select
            name="guests"
            className={styles["search-input"]}
            value={searchData.guests}
            onChange={handleSearchChange}
          >
            <option>2 Adults</option>
            <option>1 Adult</option>
            <option>Family Pack</option>
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
