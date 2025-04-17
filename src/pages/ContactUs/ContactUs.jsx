import React, { useRef } from "react";
import styles from "./ContactUs.module.css";
import Swal from "sweetalert2";
import { sendEmail } from "../../services/emailService";
import { useFormik } from "formik";
import * as Yup from "yup";

const ContactUs = () => {
  const form = useRef();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required"),
    email: Yup.string()
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    message: Yup.string()
      .required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const result = await sendEmail(form);
        console.log("Email sent successfully:", result.text);
        Swal.fire({
          title: "Success!",
          text: "Thank you for contacting us! We will get back to you soon.",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
      } catch (error) {
        console.error("Error sending email:", error.text);
        Swal.fire({
          title: "Error!",
          text: "There was a problem sending your message. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles["contact-us-container"]}>
      <div className={styles["contact-us-header"]}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below.</p>
      </div>

      <div className={styles["contact-us-form"]}>
        <form ref={form} onSubmit={formik.handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className={styles["form-input"]}
              placeholder="Enter your name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className={styles["error-message"]}>{formik.errors.name}</div>
            )}
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={styles["form-input"]}
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className={styles["error-message"]}>{formik.errors.email}</div>
            )}
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className={styles["form-input"]}
              placeholder="Write your message here"
              rows="5"
              {...formik.getFieldProps("message")}
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <div className={styles["error-message"]}>{formik.errors.message}</div>
            )}
          </div>

          <button
            type="submit"
            className={styles["btn-primary"]}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
