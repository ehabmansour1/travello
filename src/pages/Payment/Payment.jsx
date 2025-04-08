import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import "./Payment.css";

const PaymentPage = () => {
    const [newsletterEmail, setNewsletterEmail] = useState("");

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log("Newsletter subscription:", newsletterEmail);
        setNewsletterEmail("");
    };

    return (
        <>
            <div className="background">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>

                <div className="payment-container">
                    <div className="payment-header">
                        <h1>Select Payment Method</h1>
                        <p>Choose your preferred way to pay</p>
                    </div>

                    <div className="payment-grid">
                        <div className="payment-methods-container">
                            <div className="payment-methodss">
                                <div className="payment-group">
                                    <h3>Payment Gateways</h3>
                                    <div className="payment-options">
                                        <label className="payment-option">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="fawry"
                                                defaultChecked
                                            />
                                            <div className="option-content">
                                                <img
                                                    src="https://images.wuzzuf-data.net/files/company_logo/140022050961e9107b8f272.png"
                                                    alt="Fawry Pay"
                                                    width={120}
                                                    height={100}
                                                />
                                                <span>Fawry Pay</span>
                                            </div>
                                        </label>

                                        <label className="payment-option">
                                            <input type="radio" name="payment" value="paymob" />
                                            <div className="option-content">
                                                <img
                                                    src="https://static.tildacdn.com/tild3733-6365-4462-b734-663363363136/logoC.png"
                                                    alt="Paymob"
                                                />
                                                <span>Paymob</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="payment-group">
                                    <h3>Card Payment</h3>
                                    <div className="card-form">
                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <div className="card-input">
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                                <div className="card-icons">
                                                    <i className="fab fa-cc-visa"></i>
                                                    <i className="fab fa-cc-mastercard"></i>
                                                    <i className="fab fa-cc-amex"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Name on Card</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Card Holder Name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-group">
                                    <h3>Fawry Payment Instructions</h3>
                                    <div className="instruction-steps">
                                        <div className="step">
                                            <span className="step-number">1</span>
                                            <p>Note down your Fawry reference number</p>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">2</span>
                                            <p>Visit any Fawry outlet or use Fawry mobile app</p>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">3</span>
                                            <p>Pay using the reference number</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-primary pay-button">Complete Payment</button>
                        </div>

                        <div className="payment-summary">
                            <div className="summary-card">
                                <h3>Booking Summary</h3>

                                <div className="tour-info">
                                    <img
                                        src="https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b"
                                        alt="Tour"
                                    />
                                    <div>
                                        <h4>Majestic Switzerland</h4>
                                        <p>7 Days Tour Package</p>
                                        <div className="tour-meta">
                                            <span>
                                                <i className="fas fa-calendar"></i> June 15, 2024
                                            </span>
                                            <span>
                                                <i className="fas fa-users"></i> 2 Adults
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>Tour Price (2 Adults)</span>
                                        <span>$4,998</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Taxes & Fees</span>
                                        <span>$199</span>
                                    </div>
                                    <div className="price-row total">
                                        <span>Total Amount</span>
                                        <span>$5,197</span>
                                    </div>
                                </div>

                                <div className="secure-payment">
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
