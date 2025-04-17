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
                        <label>First Name *</label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                            placeholder="Enter first name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name *</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                            placeholder="Enter last name"
                        />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp Number *</label>
                        <input 
                            type="tel" 
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                            placeholder="Enter WhatsApp number"
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="form-input" 
                            required 
                            placeholder="Enter phone number"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}