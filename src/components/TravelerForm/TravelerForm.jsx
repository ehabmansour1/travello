import React from 'react';
import './TravelerForm.css';

export default function TravelerForm() {
    return (
        <div className="booking-step" id="step2">
            <h2>Traveler Information</h2>
            <div className="travelers-info">
                <h3>Lead Traveler</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" className="form-input" required />
                    </div>
                </div>

                <h3>Additional Travelers</h3>
                <div className="additional-travelers">
                    <div className="form-grid">
                        <div>
                        <h3>adult 2</h3>

                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" className="form-input" required />
                        </div>
                        </div>
                        
                        <div>
                            <h3>adult 3</h3>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="email" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="tel" className="form-input" required />
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}