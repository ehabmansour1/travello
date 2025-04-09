import React, { useState } from "react";
// import { useParams } from "react-router-dom"; // Removed unused import
import styles from "./TourDetails.module.css"; // استيراد كـ module

const TourDetails = () => {
  const [mainImage, setMainImage] = useState(
    "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b"
  );
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [quantity, setQuantity] = useState(2);

  // const { id } = useParams(); // Removed unused id

  const thumbnails = [
    "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
  ];

  const pricePerPerson = 2499;
  const taxRate = 199;

  const handleThumbnailClick = (src, index) => {
    setMainImage(src);
    setActiveThumbnail(index);
  };

  const updateTotal = () => {
    const subtotal = pricePerPerson * quantity; // Keep subtotal for calculation
    const total = subtotal + taxRate;
    // Removed unused subtotal from return
    return { total };
  };

  // Removed unused subtotal
  const { total } = updateTotal();

  return (
    <div className={styles["tour-details-container"]}>
      <div className={styles["tour-details-header"]}>
        <button
          className={styles["btn-back"]}
          onClick={() => window.history.back()}
        >
          <i className="fas fa-arrow-left"></i> Back to Tours
        </button>
        <h1>Majestic Switzerland</h1>
        <div className={styles["tour-meta"]}>
          <div className={styles["tour-rating"]}>
            <span>★★★★★</span>
            <span>(4.9)</span>
          </div>
          <div className={styles["tour-location"]}>
            <i className="fas fa-map-marker-alt"></i>
            <span>Zurich • Lucerne • Interlaken • Zermatt</span>
          </div>
        </div>
      </div>

      <div className={styles["tour-gallery"]}>
        <div className={styles["gallery-main"]}>
          <img src={mainImage} alt="Main Tour" />
        </div>
        <div className={styles["gallery-thumbnails"]}>
          {thumbnails.map((thumb, index) => (
            <img
              key={index}
              src={thumb}
              alt={`Thumbnail ${index + 1}`}
              className={activeThumbnail === index ? styles["active"] : ""}
              onClick={() => handleThumbnailClick(thumb, index)}
            />
          ))}
        </div>
      </div>

      <div className={styles["tour-content-grid"]}>
        <div className={styles["tour-main-content"]}>
          <section className={styles["tour-section"]}>
            <h2>Tour Overview</h2>
            <p>
              Experience the breathtaking beauty of Switzerland on this 7-day
              adventure through the heart of the Alps. From pristine lakes to
              snow-capped peaks, immerse yourself in the natural wonders and
              cultural richness of this amazing country.
            </p>
          </section>

          <section className={styles["tour-section"]}>
            <h2>Itinerary</h2>
            <div className={styles["itinerary-timeline"]}>
              <div className={styles["timeline-item"]}>
                <div className={styles["day-badge"]}>Day 1</div>
                <div className={styles["timeline-content"]}>
                  <h3>Arrival in Zurich</h3>
                  <p>
                    Welcome meeting, city orientation walk, and welcome dinner
                  </p>
                  <div className={styles["included-items"]}>
                    <span className={styles["included-item"]}>
                      <i className="fas fa-utensils"></i> Dinner
                    </span>
                    <span className={styles["included-item"]}>
                      <i className="fas fa-hotel"></i> Hotel
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles["timeline-item"]}>
                <div className={styles["day-badge"]}>Day 2</div>
                <div className={styles["timeline-content"]}>
                  <h3>Lucerne Explorer</h3>
                  <p>
                    Chapel Bridge, Lion Monument, Lake cruise, and free time
                  </p>
                  <div className={styles["included-items"]}>
                    <span className={styles["included-item"]}>
                      <i className="fas fa-utensils"></i> Breakfast
                    </span>
                    <span className={styles["included-item"]}>
                      <i className="fas fa-hotel"></i> Hotel
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles["tour-section"]}>
            <h2>What's Included</h2>
            <div className={styles["included-grid"]}>
              <div className={styles["included-category"]}>
                <h3>Accommodation</h3>
                <ul>
                  <li>
                    <i className="fas fa-check"></i> 6 nights in 4-star hotels
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Breakfast included daily
                  </li>
                </ul>
              </div>
              <div className={styles["included-category"]}>
                <h3>Transportation</h3>
                <ul>
                  <li>
                    <i className="fas fa-check"></i> Airport transfers
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Swiss Travel Pass
                  </li>
                </ul>
              </div>
              <div className={styles["included-category"]}>
                <h3>Activities</h3>
                <ul>
                  <li>
                    <i className="fas fa-check"></i> Guided city tours
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Mountain excursions
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className={styles["tour-sidebar"]}>
          <div className={styles["booking-card"]}>
            <div className={styles["booking-price"]}>
              <span className={styles["price-amount"]}>${pricePerPerson}</span>
              <span className={styles["price-per"]}>per person</span>
            </div>

            <div className={styles["booking-dates"]}>
              <h4>Available Dates</h4>
              <div className={styles["date-selector"]}>
                <select className={styles["form-input"]}>
                  <option>June 15, 2024</option>
                  <option>July 1, 2024</option>
                  <option>July 15, 2024</option>
                </select>
              </div>
            </div>

            <div className={styles["booking-guests"]}>
              <h4>Number of Guests</h4>
              <div className={styles["quantity-selector"]}>
                <button
                  className={styles["quantity-btn"]}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles["quantity-input"]}
                  value={quantity}
                  min="1"
                  max="15"
                  readOnly
                />
                <button
                  className={styles["quantity-btn"]}
                  onClick={() => setQuantity((prev) => Math.min(15, prev + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles["booking-total"]}>
              <div className={styles["total-row"]}>
                <span>Tour Price</span>
                <span>
                  ${pricePerPerson} × {quantity}
                </span>
              </div>
              <div className={styles["total-row"]}>
                <span>Taxes & Fees</span>
                <span>${taxRate}</span>
              </div>
              <div className={styles["total-row final"]}>
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button
              className={styles["btn-primary"]}
              onClick={() => alert("Booking functionality coming soon!")}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
