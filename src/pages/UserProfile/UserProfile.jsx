import React, { useState } from 'react';
import "./UserProfile.css"

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [avatar, setAvatar] = useState('');

  // Handle tab navigation
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form data:', Object.fromEntries(formData));
    showNotification('Changes saved successfully!');
  };

  // Show notifications
  const showNotification = (message) => {
    alert(message);
  };

  return (
    <div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-tabs">
            <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} data-tab="personal" onClick={() => handleTabClick('personal')}>
              <i className="fas fa-user"></i> Personal Information
            </button>
            <button className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`} data-tab="preferences" onClick={() => handleTabClick('preferences')}>
              <i className="fas fa-sliders-h"></i> Travel Preferences
            </button>
            <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} data-tab="security" onClick={() => handleTabClick('security')}>
              <i className="fas fa-shield-alt"></i> Security
            </button>
            <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} data-tab="notifications" onClick={() => handleTabClick('notifications')}>
              <i className="fas fa-bell"></i> Notifications
            </button>
            <button className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`} data-tab="payment" onClick={() => handleTabClick('payment')}>
              <i className="fas fa-credit-card"></i> Payment Methods
            </button>
          </div>
        </div>

        <div className="profile-content">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="profile-tab active" id="personal">
              <h2>Personal Information</h2>
              <div className="profile-header">
                <div className="avatar-upload">
                  <img src={avatar || ''} alt="Profile" className="large-avatar" />
                  <button className="btn-secondary upload-btn" onClick={() => document.getElementById('avatar-upload').click()}>
                    <i className="fas fa-camera"></i> Change Photo
                  </button>
                  <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                </div>
              </div>

              <form className="profile-form" onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-input" defaultValue="John" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" className="form-input" defaultValue="Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-input" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" className="form-input" defaultValue="+1 234 567 8900" />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input type="text" className="form-input" defaultValue="123 Travel Street" />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" className="form-input" defaultValue="New York" />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select className="form-input" defaultValue="US">
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary save-btn">Save Changes</button>
              </form>
            </div>
          )}

          {/* Travel Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="profile-tab" id="preferences">
              <h2>Travel Preferences</h2>
              <form className="profile-form" onSubmit={handleFormSubmit}>
                <div className="preferences-grid">
                  <div className="preference-card">
                    <h3>Travel Style</h3>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked /> Adventure
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Cultural
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked /> Luxury
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Beach
                      </label>
                    </div>
                  </div>

                  <div className="preference-card">
                    <h3>Accommodation</h3>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input type="radio" name="accommodation" defaultChecked /> Luxury Hotels
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="accommodation" /> Boutique Hotels
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="accommodation" /> Budget-Friendly
                      </label>
                    </div>
                  </div>

                  <div className="preference-card">
                    <h3>Dietary Requirements</h3>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" /> Vegetarian
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Vegan
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Gluten-Free
                      </label>
                    </div>
                  </div>

                  <div className="preference-card">
                    <h3>Special Assistance</h3>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" /> Wheelchair Access
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Airport Transfer
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-primary save-btn">Save Preferences</button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="profile-tab" id="security">
              <h2>Security Settings</h2>
              <div className="security-section">
                <h3>Change Password</h3>
                <form className="profile-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <button type="submit" className="btn-primary save-btn">Save Changes</button>
                </form>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="profile-tab" id="notifications">
              <h2>Notification Preferences</h2>
              <form className="profile-form">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked /> Email Notifications
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" /> SMS Notifications
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked /> App Notifications
                  </label>
                </div>
                <button type="submit" className="btn-primary save-btn">Save Notifications</button>
              </form>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payment' && (
            <div className="profile-tab" id="payment">
              <h2>Payment Methods</h2>
              <form className="profile-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Expiration Date</label>
                  <input type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" className="form-input" />
                </div>
                <button type="submit" className="btn-primary save-btn">Save Payment</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
