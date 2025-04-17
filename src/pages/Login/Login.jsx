import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseContext";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.css";

const Login = () => {
  const { login, getUserData } = useFirebase();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const userCredential = await login(values.email, values.password);
        const userData = await getUserData(userCredential.uid);
        const userRole = userData?.role || "user";

        Swal.fire({
          title: "Success!",
          text: "You have successfully logged in.",
          icon: "success",
          confirmButtonText: "Continue",
        }).then(() => {
          if (userRole === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        });
      } catch {
        setErrors({ 
          general: "The email or password may be incorrect. Please try again." 
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Welcome Back</h1>
        <p>Please enter your details to sign in</p>

        {formik.errors.general && (
          <div className="error-message">{formik.errors.general}</div>
        )}

        <form className="login-form" onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>

          <Link to="/forget-password" className="register-link">
            Forget Password?
          </Link>
          <button
            type="submit"
            className="btn-primary login-btn"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
