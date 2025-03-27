import React, { useState } from "react";
import "./Tours.css";

const Tours = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tours = [
    {
      id: 3,
      name: "Swiss Alps",
      location: "Switzerland",
      price: 2500,
      duration: "6 days",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=80&w=1000&auto=format&fit=crop",
      category: "adventure",
    },
    {
      id: 4,
      name: "Tokyo City",
      location: "Japan",
      price: 1800,
      duration: "8 days",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop",
      category: "cultural",
    },

    {
      id: 6,
      name: "Machu Picchu",
      location: "Peru",
      price: 2200,
      duration: "7 days",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
      category: "historical",
    },
  ];

  const filteredTours =
    activeTab === "all"
      ? tours
      : tours.filter((tour) => tour.category === activeTab);

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h1>Our Tours</h1>
        <p>Discover amazing destinations with our curated tours</p>
      </div>

      <div className="tours-grid">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <div className="tour-image">
              <img src={tour.image} alt={tour.name} />
              <div className="tour-price">${tour.price}</div>
            </div>
            <div className="tour-content">
              <div className="tour-header">
                <h3>{tour.name}</h3>
                <div className="tour-rating">
                  <i className="fas fa-star"></i>
                  <span>{tour.rating}</span>
                </div>
              </div>
              <div className="tour-info">
                <span>
                  <i className="fas fa-map-marker-alt"></i> {tour.location}
                </span>
                <span>
                  <i className="fas fa-clock"></i> {tour.duration}
                </span>
              </div>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tours;
