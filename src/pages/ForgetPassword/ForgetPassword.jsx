import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="background">

      <div className="login-container">
        <div className="login-content">
          <h1>Reset Password</h1>
          <p>Enter your email address and we'll send you instructions to reset your password</p>

          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary login-btn">Send Reset Link</button>
          </form>

          <div className="login-footer">
            <p>
              Remember your password?{" "}
              <Link to="/login" className="register-link" onClick={handleLoginRedirect}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
