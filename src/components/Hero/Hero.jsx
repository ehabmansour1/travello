import React from "react";
import "./Hero.css";

const Hero = ({ searchData, handleSearchChange, handleSearchSubmit }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Discover Your Next Adventure</h1>
        <p>
          Explore breathtaking destinations and create unforgettable memories
        </p>

        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="destination"
            className="search-input"
            placeholder="Where would you like to go?"
            value={searchData.destination}
            onChange={handleSearchChange}
          />
          <input
            type="date"
            name="date"
            className="search-input"
            value={searchData.date}
            onChange={handleSearchChange}
          />
          <select
            name="guests"
            className="search-input"
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
