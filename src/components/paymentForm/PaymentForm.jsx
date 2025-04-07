import React from 'react';
import './PaymentForm.css';

export default function PaymentForm() {
    return (
        <div className="booking-step" id="step3">
            <h2>Payment Details</h2>
            <div className="payment-methods">
                <div className="payment-method">
                    <input type="radio" name="payment" id="card" defaultChecked />
                    <label htmlFor="card">Credit/Debit Card</label>
                </div>
                <div className="payment-method">
                    <input type="radio" name="payment" id="paypal" />
                    <label htmlFor="paypal">PayPal</label>
                </div>
            </div>

            <div className="card-details">
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Card Number</label>
                        <input type="text" className="form-input" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" className="form-input" placeholder="MM/YY" required />
                    </div>
                    <div className="form-group">
                        <label>CVV</label>
                        <input type="text" className="form-input" placeholder="123" required />
                    </div>
                    <div className="form-group full-width">
                        <label>Name on Card</label>
                        <input type="text" className="form-input" required />
                    </div>
                </div>
            </div>

        </div>
    );
}