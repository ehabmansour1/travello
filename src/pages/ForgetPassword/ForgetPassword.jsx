import React from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseContext";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgetPassword() {
  const { resetPassword } = useFirebase();

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await resetPassword(values.email);
        setStatus({ success: "Password reset email sent. Please check your inbox." });
      } catch (error) {
        setStatus({ error: error.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Reset Password</h1>
        <p>
          Enter your email address and we'll send you instructions to reset your
          password
        </p>
        <hr />
        <form className="login-form" onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          {formik.status?.error && (
          <div className="error-message">{formik.status.error}</div>
        )}
        {formik.status?.success && (
          <div className="success-message">{formik.status.success}</div>
        )}


          <button
            type="submit"
            className="btn-primary login-btn"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="register-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
