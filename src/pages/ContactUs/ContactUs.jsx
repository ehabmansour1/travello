import React, { useState, useRef } from "react";
import styles from "./ContactUs.module.css";
import Swal from "sweetalert2";
import { sendEmail } from "../../services/emailService";

const ContactUs = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendEmail(form)
      .then((result) => {
        console.log("Email sent successfully:", result.text);
        Swal.fire({
          title: "Success!",
          text: "Thank you for contacting us! We will get back to you soon.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Error sending email:", error.text);
        Swal.fire({
          title: "Error!",
          text: "There was a problem sending your message. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className={styles["contact-us-container"]}>
      <div className={styles["contact-us-header"]}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below.</p>
      </div>

      <div className={styles["contact-us-form"]}>
        <form ref={form} onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className={styles["btn-primary"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
