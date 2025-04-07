import React, { useState } from 'react';
import { useParams } from "react-router-dom";


const TourDetails = () => {
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b');
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [quantity, setQuantity] = useState(2);

  const { id } = useParams();

  const thumbnails = [
    'https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b',
    'https://images.unsplash.com/photo-1578336647731-f08596362c9a',
    'https://images.unsplash.com/photo-1602941900552-4ae132a5f9d9',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
  ];

  const pricePerPerson = 2499;
  const taxRate = 199;

  const handleThumbnailClick = (src, index) => {
    setMainImage(src);
    setActiveThumbnail(index);
  };

  const updateTotal = () => {
    const subtotal = pricePerPerson * quantity;
    const total = subtotal + taxRate;
    return { subtotal, total };
  };

  const { subtotal, total } = updateTotal();

  return (
    <div className="tour-details-container">
      <div className="tour-details-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left"></i> Back to Tours
        </button>
        <h1>Majestic Switzerland</h1>
        <div className="tour-meta">
          <div className="tour-rating">
            <span>★★★★★</span>
            <span>(4.9)</span>
          </div>
          <div className="tour-location">
            <i className="fas fa-map-marker-alt"></i>
            <span>Zurich • Lucerne • Interlaken • Zermatt</span>
          </div>
        </div>
      </div>

      <div className="tour-gallery">
        <div className="gallery-main">
          <img src={mainImage} alt="Main Tour" />
        </div>
        <div className="gallery-thumbnails">
          {thumbnails.map((thumb, index) => (
            <img
              key={index}
              src={thumb}
              alt={`Thumbnail ${index + 1}`}
              className={activeThumbnail === index ? 'active' : ''}
              onClick={() => handleThumbnailClick(thumb, index)}
            />
          ))}
        </div>
      </div>

      <div className="tour-content-grid">
        <div className="tour-main-content">
          <section className="tour-section">
            <h2>Tour Overview</h2>
            <p>
              Experience the breathtaking beauty of Switzerland on this 7-day
              adventure through the heart of the Alps. From pristine lakes to
              snow-capped peaks, immerse yourself in the natural wonders and
              cultural richness of this amazing country.
            </p>
          </section>

          <section className="tour-section">
            <h2>Itinerary</h2>
            <div className="itinerary-timeline">
              <div className="timeline-item">
                <div className="day-badge">Day 1</div>
                <div className="timeline-content">
                  <h3>Arrival in Zurich</h3>
                  <p>Welcome meeting, city orientation walk, and welcome dinner</p>
                  <div className="included-items">
                    <span className="included-item"><i className="fas fa-utensils"></i> Dinner</span>
                    <span className="included-item"><i className="fas fa-hotel"></i> Hotel</span>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="day-badge">Day 2</div>
                <div className="timeline-content">
                  <h3>Lucerne Explorer</h3>
                  <p>Chapel Bridge, Lion Monument, Lake cruise, and free time</p>
                  <div className="included-items">
                    <span className="included-item"><i className="fas fa-utensils"></i> Breakfast</span>
                    <span className="included-item"><i className="fas fa-hotel"></i> Hotel</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="tour-section">
          <h2>What's Included</h2>
          <div class="included-grid">
            <div class="included-category">
              <h3>Accommodation</h3>
              <ul>
                <li><i class="fas fa-check"></i> 6 nights in 4-star hotels</li>
                <li><i class="fas fa-check"></i> Breakfast included daily</li>
              </ul>
            </div>
            <div class="included-category">
              <h3>Transportation</h3>
              <ul>
                <li><i class="fas fa-check"></i> Airport transfers</li>
                <li><i class="fas fa-check"></i> Swiss Travel Pass</li>
              </ul>
            </div>
            <div class="included-category">
              <h3>Activities</h3>
              <ul>
                <li><i class="fas fa-check"></i> Guided city tours</li>
                <li><i class="fas fa-check"></i> Mountain excursions</li>
              </ul>
            </div>
          </div>
        </section>
        </div>

        <div className="tour-sidebar">
          <div className="booking-card">
            <div className="booking-price">
              <span className="price-amount">${pricePerPerson}</span>
              <span className="price-per">per person</span>
            </div>

            <div className="booking-dates">
              <h4>Available Dates</h4>
              <div className="date-selector">
                <select className="form-input">
                  <option>June 15, 2024</option>
                  <option>July 1, 2024</option>
                  <option>July 15, 2024</option>
                </select>
              </div>
            </div>

            <div className="booking-guests">
              <h4>Number of Guests</h4>
              <div className="quantity-selector">
                <button
                  className="quantity-btn minus"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  min="1"
                  max="15"
                  readOnly
                />
                <button
                  className="quantity-btn plus"
                  onClick={() => setQuantity(prev => Math.min(15, prev + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="booking-total">
              <div className="total-row">
                <span>Tour Price</span>
                <span>${pricePerPerson} × {quantity}</span>
              </div>
              <div className="total-row">
                <span>Taxes & Fees</span>
                <span>${taxRate}</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button className="btn-primary book-btn" onClick={() => alert('Booking functionality coming soon!')}>
              Book Now
            </button>
            <button className="btn-secondary inquire-btn" onClick={() => alert('Inquiry form coming soon!')}>
              Inquire About Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;