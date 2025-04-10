import React from "react";
import "./TermsAndPrivacy.css";

export default function TermsAndPrivacy() {
  return (
    <div className="terms-container">
      <h1>Terms and Privacy Policy</h1>
      <p className="intro-text">
        Welcome to our Terms and Privacy Policy page. Please read the following carefully to understand your rights and obligations.
      </p>
      <div className="section">
        <h2>Terms of Service</h2>
        <p>
          By using our website, you agree to the following terms and conditions. These terms govern your use of our services and website.
        </p>
        <ul>
          <li>You must not misuse our services.</li>
          <li>All content is for personal use only.</li>
          <li>We reserve the right to terminate accounts for violations.</li>
        </ul>
      </div>
      <div className="section">
        <h2>Privacy Policy</h2>
        <p>
          We value your privacy. Here’s how we handle your data to ensure your information is secure and protected.
        </p>
        <ul>
          <li>We do not share your data with third parties without consent.</li>
          <li>Your data is stored securely using industry-standard encryption.</li>
          <li>You can request data deletion or updates at any time.</li>
        </ul>
      </div>
      <p className="footer-text">
        For more information, feel free to <a href="/contact">contact us</a>.
      </p>
    </div>
  );
}