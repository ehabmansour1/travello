import React, { useState } from 'react';
import './TravelerForm.css';

export default function TravelerForm({ onFormDataChange }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        whatsapp: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedData);
        onFormDataChange(updatedData);
    };

    return (
        <div className="booking-step" id="step2">
            <h2>Traveler Information</h2>
            <div className="travelers-info">
                <h3>Lead Traveler</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Whatsapp</label>
                        <input 
                            type="tel" 
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}