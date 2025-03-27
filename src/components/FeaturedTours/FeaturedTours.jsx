import React from "react";
import { Link } from "react-router-dom";
import "./FeaturedTours.css";

const FeaturedTours = ({ tours }) => {
  return (
    <section className="featured-tours">
      <div className="section-header">
        <h2>Featured Tour Packages</h2>
        <p>Curated experiences for unforgettable journeys</p>
      </div>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <div
              className="tour-image"
              style={{ backgroundImage: `url(${tour.image})` }}
            ></div>
            <div className="tour-content">
              <h3>{tour.title}</h3>
              <div className="tour-rating">★ {tour.rating}</div>
              <p>{tour.description}</p>
              <div className="tour-details">
                <span className="tour-price">${tour.price}</span>
                <span className="tour-duration">{tour.duration}</span>
              </div>
              <Link to={`/tours/${tour.id}`} className="btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedTours;
