import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TourDetails.module.css";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourDoc = doc(db, "tours", id);
        const tourSnap = await getDoc(tourDoc);
        
        if (tourSnap.exists()) {
          setTour({ id: tourSnap.id, ...tourSnap.data() });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Tour Not Found',
            text: 'The tour you are looking for does not exist.',
          }).then(() => {
            navigate('/tours');
          });
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load tour details. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={styles["tour-details-container"]}>
        <div className={styles.loading}>Loading tour details...</div>
      </div>
    );
  }

  if (!tour) {
    return null;
  }

  return (
    <div className={styles["tour-details-container"]}>
      <div className={styles["tour-details-header"]}>
        <button
          className={styles["btn-back"]}
          onClick={() => navigate('/tours')}
        >
          <i className="fas fa-arrow-left"></i> Back to Tours
        </button>
        <h1>{tour.title}</h1>
        <div className={styles["tour-meta"]}>
        <div className="tour-rating">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star ${index < (tour.rating || 0) ? 'active' : ''}`}
                  ></i>
                ))}
                <span className="rating-text">({tour.rating || 0}/5)</span>
              </div>
          <div className={styles["tour-location"]}>
            <i className="fas fa-map-marker-alt"></i>
            <span>{tour.location || 'Location not specified'}</span>
          </div>
        </div>
      </div>

      <div className={styles["tour-gallery"]}>
        <div className={styles["gallery-main"]}>
          <img src={tour.image} alt={tour.title} />
        </div>
      </div>

      <div className={styles["tour-content-grid"]}>
        <div className={styles["tour-main-content"]}>
          <section className={styles["tour-section"]}>
            <h2>Tour Overview</h2>
            <p>{tour.description}</p>
          </section>

          <section className={styles["tour-section"]}>
            <h2>Tour Details</h2>
            <div className={styles["tour-highlights"]}>
              <div className={styles["highlight-item"]}>
                <i className="fas fa-clock"></i>
                <h3>Duration</h3>
                <p>{tour.duration} days</p>
              </div>
              <div className={styles["highlight-item"]}>
                <i className="fas fa-users"></i>
                <h3>Group Size</h3>
                <p>Max {tour.maxGroupSize} people</p>
              </div>
              <div className={styles["highlight-item"]}>
                <i className="fas fa-mountain"></i>
                <h3>Category</h3>
                <p>{tour.category}</p>
              </div>
              <div className={styles["highlight-item"]}>
                <i className="fas fa-signal"></i>
                <h3>Difficulty</h3>
                <p>{tour.difficulty}</p>
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
                    <i className="fas fa-check"></i> Hotel accommodation
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
                    <i className="fas fa-check"></i> Local transportation
                  </li>
                </ul>
              </div>
              <div className={styles["included-category"]}>
                <h3>Activities</h3>
                <ul>
                  <li>
                    <i className="fas fa-check"></i> Guided tours
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Entry fees
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className={styles["tour-sidebar"]}>
          <div className={styles["booking-card"]}>
            <div className={styles["booking-price"]}>
              <span className={styles["price-amount"]}>${tour.price}</span>
              <span className={styles["price-per"]}>per person</span>
            </div>
            <button
              className={styles["btn-primary"]}
              onClick={() => navigate(`/booking/${tour.id}`)}
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
