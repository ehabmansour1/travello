import React from "react";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles["about-page"]}>
      <section
        className={`${styles["about-section"]} ${styles["mission-vision"]}`}
      >
        <div className={styles["section-content"]}>
          <h2>Our Mission & Vision</h2>
          <p>
            <strong>Mission:</strong> To inspire and enable unforgettable travel
            experiences by providing curated tours, exceptional service, and a
            seamless booking process. We believe travel connects people,
            broadens horizons, and creates lasting memories.
          </p>
          <p>
            <strong>Vision:</strong> To be the most trusted and innovative
            platform for discovering and booking unique travel adventures
            worldwide, fostering a global community of passionate explorers.
          </p>
        </div>
        <div className={styles["section-image"]}>
          {/* Placeholder for an image related to mission/vision */}
          <img
            src="https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=800"
            alt="Compass and map"
          />
        </div>
      </section>

      <section className={`${styles["about-section"]} ${styles["our-story"]}`}>
        <div className={styles["section-image"]}>
          {/* Placeholder for an image related to the company story */}
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800"
            alt="Travelers planning a trip"
          />
        </div>
        <div className={styles["section-content"]}>
          <h2>Our Story</h2>
          <p>
            Founded by a group of avid travelers, Travello started with a simple
            idea: make discovering and booking amazing trips easier. We were
            frustrated with generic packages and complex booking sites. We
            wanted to create a platform that reflects the passion and excitement
            of travel itself.
          </p>
          <p>
            From humble beginnings, we've grown into a dedicated team committed
            to sourcing unique destinations, partnering with local experts, and
            leveraging technology to enhance every step of your journey.
          </p>
        </div>
      </section>

      <section
        className={`${styles["about-section"]} ${styles["why-choose-us"]}`}
      >
        <h2>Why Choose Travello?</h2>
        <div className={styles["features-grid"]}>
          <div className={styles["feature-item"]}>
            <i className="fas fa-map-marked-alt"></i>{" "}
            {/* Assuming Font Awesome */}
            <h3>Curated Experiences</h3>
            <p>Handpicked tours focusing on authenticity and quality.</p>
          </div>
          <div className={styles["feature-item"]}>
            <i className="fas fa-headset"></i> {/* Assuming Font Awesome */}
            <h3>Expert Support</h3>
            <p>Dedicated travel advisors available 24/7.</p>
          </div>
          <div className={styles["feature-item"]}>
            <i className="fas fa-lock"></i> {/* Assuming Font Awesome */}
            <h3>Seamless Booking</h3>
            <p>Easy, secure, and transparent online booking.</p>
          </div>
          <div className={styles["feature-item"]}>
            <i className="fas fa-globe"></i> {/* Assuming Font Awesome */}
            <h3>Global Community</h3>
            <p>Join fellow travelers and share your adventures.</p>
          </div>
        </div>
      </section>

      {/* Optional: Team Section */}
      {/*
      <section className={`${styles['about-section']} ${styles['team-section']}`}>
        <h2>Meet Our Team</h2>
        <div className={styles['team-grid']}>
          {/* Add team member cards here *}
          <div className={styles['team-member']}>Member 1</div>
          <div className={styles['team-member']}>Member 2</div>
          <div className={styles['team-member']}>Member 3</div>
        </div>
      </section>
      */}
    </div>
  );
};

export default About;
