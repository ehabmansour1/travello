import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseContext";
import Swal from "sweetalert2";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, getUserData } = useFirebase();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await login(formData.email, formData.password);
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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Welcome Back</h1>
        <p>Please enter your details to sign in</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Link to="/forget-password" className="register-link">
              Forget Password?
            </Link>
          <button
            type="submit"
            className="btn-primary login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
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
