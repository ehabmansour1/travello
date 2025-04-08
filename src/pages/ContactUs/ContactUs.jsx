import React, { useState } from "react";
import styles from "./ContactUs.module.css"; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles["contact-us-container"]}>
      <div className={styles["contact-us-header"]}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below.</p>
      </div>

      <div className={styles["contact-us-form"]}>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here"
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className={styles["btn-primary"]}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;