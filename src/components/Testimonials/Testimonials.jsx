import React from "react";
import "./Testimonials.css";

const Testimonials = ({ testimonials, currentTestimonial }) => {
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <section className="testimonials">
      <div className="section-header">
        <h2>What Our Travelers Say</h2>
        <p>Real experiences from real adventurers</p>
      </div>

      <div className="testimonial-slider">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`testimonial-card ${
              index === currentTestimonial ? "active" : ""
            }`}
          >
            <div
              className="testimonial-avatar"
              style={{ backgroundImage: `url(${testimonial.avatar})` }}
            ></div>
            <div className="testimonial-rating">{renderStars(testimonial.rating)}</div>
            <p>{testimonial.text}</p>
            <h4>{testimonial.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
