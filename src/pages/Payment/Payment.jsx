import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import styles from "./Payment.module.css"; // استيراد CSS Module

const PaymentPage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription:", newsletterEmail);
    setNewsletterEmail("");
  };

  return (
    <>
      <div className={styles.background}>
        <div className={styles["gradient-sphere"]}></div>
        <div className={`${styles["gradient-sphere"]} ${styles.secondary}`}></div>

        <div className={styles["payment-container"]}>
          <div className={styles["payment-header"]}>
            <h1>Select Payment Method</h1>
            <p>Choose your preferred way to pay</p>
          </div>

          <div className={styles["payment-grid"]}>
            <div className={styles["payment-methods-container"]}>
              <div className={styles["payment-methodss"]}>
                <div className={styles["payment-group"]}>
                  <h3>Payment Gateways</h3>
                  <div className={styles["payment-options"]}>
                    <label className={styles["payment-option"]}>
                      <input
                        type="radio"
                        name="payment"
                        value="fawry"
                        defaultChecked
                      />
                      <div className={styles["option-content"]}>
                        <img
                          src="https://images.wuzzuf-data.net/files/company_logo/140022050961e9107b8f272.png"
                          alt="Fawry Pay"
                          width={120}
                          height={100}
                        />
                        <span>Fawry Pay</span>
                      </div>
                    </label>

                    <label className={styles["payment-option"]}>
                      <input type="radio" name="payment" value="paymob" />
                      <div className={styles["option-content"]}>
                        <img
                          src="https://static.tildacdn.com/tild3733-6365-4462-b734-663363363136/logoC.png"
                          alt="Paymob"
                        />
                        <span>Paymob</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={styles["payment-group"]}>
                  <h3>Card Payment</h3>
                  <div className={styles["card-form"]}>
                    <div className={styles["form-group"]}>
                      <label>Card Number</label>
                      <div className={styles["card-input"]}>
                        <input
                          type="text"
                          className={styles["form-input"]}
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className={styles["card-icons"]}>
                          <i className="fab fa-cc-visa"></i>
                          <i className="fab fa-cc-mastercard"></i>
                          <i className="fab fa-cc-amex"></i>
                        </div>
                      </div>
                    </div>

                    <div className={styles["form-grid"]}>
                      <div className={styles["form-group"]}>
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          className={styles["form-input"]}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className={styles["form-group"]}>
                        <label>CVV</label>
                        <input
                          type="text"
                          className={styles["form-input"]}
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className={styles["form-group"]}>
                      <label>Name on Card</label>
                      <input
                        type="text"
                        className={styles["form-input"]}
                        placeholder="Card Holder Name"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles["payment-group"]}>
                  <h3>Fawry Payment Instructions</h3>
                  <div className={styles["instruction-steps"]}>
                    <div className={styles["step"]}>
                      <span className={styles["step-number"]}>1</span>
                      <p>Note down your Fawry reference number</p>
                    </div>
                    <div className={styles["step"]}>
                      <span className={styles["step-number"]}>2</span>
                      <p>Visit any Fawry outlet or use Fawry mobile app</p>
                    </div>
                    <div className={styles["step"]}>
                      <span className={styles["step-number"]}>3</span>
                      <p>Pay using the reference number</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className={`${styles["btn-primary"]} ${styles["pay-button"]}`}>
                Complete Payment
              </button>
            </div>

            <div className={styles["payment-summary"]}>
              <div className={styles["summary-card"]}>
                <h3>Booking Summary</h3>

                <div className={styles["tour-info"]}>
                  <img
                    src="https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b"
                    alt="Tour"
                  />
                  <div>
                    <h4>Majestic Switzerland</h4>
                    <p>7 Days Tour Package</p>
                    <div className={styles["tour-meta"]}>
                      <span>
                        <i className="fas fa-calendar"></i> June 15, 2024
                      </span>
                      <span>
                        <i className="fas fa-users"></i> 2 Adults
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles["price-breakdown"]}>
                  <div className={styles["price-row"]}>
                    <span>Tour Price (2 Adults)</span>
                    <span>$4,998</span>
                  </div>
                  <div className={styles["price-row"]}>
                    <span>Taxes & Fees</span>
                    <span>$199</span>
                  </div>
                  <div className={`${styles["price-row"]} ${styles.total}`}>
                    <span>Total Amount</span>
                    <span>$5,197</span>
                  </div>
                </div>

                <div className={styles["secure-payment"]}>
                  <i className="fas fa-lock"></i>
                  <p>Your payment is secure and encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        newsletterEmail={newsletterEmail}
        handleNewsletterSubmit={handleNewsletterSubmit}
        setNewsletterEmail={setNewsletterEmail}
      />
    </>
  );
};

export default PaymentPage;
