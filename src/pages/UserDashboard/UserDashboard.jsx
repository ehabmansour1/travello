import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { updatePassword } from "firebase/auth";
import Swal from "sweetalert2";
import "./UserProfile.css";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    travelPreferences: {
      travelStyle: [],
      accommodation: "",
      dietaryRequirements: [],
      specialAssistance: [],
    },
  });
  const { user } = useFirebase();

  // Comprehensive country list
  const countries = [
    { code: "EG", name: "Egypt" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "RU", name: "Russia" },
    { code: "ZA", name: "South Africa" },
    { code: "MX", name: "Mexico" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SG", name: "Singapore" },
    { code: "TH", name: "Thailand" },
    { code: "VN", name: "Vietnam" },
    { code: "ID", name: "Indonesia" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              ...data,
              travelPreferences: data.travelPreferences || {
                travelStyle: [],
                accommodation: "",
                dietaryRequirements: [],
                specialAssistance: [],
              },
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          showNotification("Error loading profile data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setSaving(true);
      const updatedData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        country: formData.get("country"),
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, "users", user.uid), updatedData);
      setUserData((prev) => ({ ...prev, ...updatedData }));
      showNotification("Personal information updated successfully!");
    } catch (error) {
      console.error("Error updating personal info:", error);
      showNotification("Error updating personal information");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setSaving(true);
      const travelPreferences = {
        travelStyle: Array.from(formData.getAll("travelStyle")),
        accommodation: formData.get("accommodation"),
        dietaryRequirements: Array.from(formData.getAll("dietaryRequirements")),
        specialAssistance: Array.from(formData.getAll("specialAssistance")),
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, "users", user.uid), {
        travelPreferences,
      });

      setUserData((prev) => ({
        ...prev,
        travelPreferences,
      }));

      showNotification("Travel preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      showNotification("Error updating travel preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      showNotification("New passwords do not match", "error");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("Password must be at least 6 characters long", "error");
      return;
    }

    try {
      setSaving(true);

      // Update the password using Firebase Auth
      await updatePassword(user, newPassword);

      // Clear the form
      e.target.reset();

      showNotification("Password updated successfully!", "success");
    } catch (error) {
      console.error("Error updating password:", error);
      let errorMessage = "Error updating password";

      // Handle specific Firebase auth errors
      if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please log out and log in again before changing your password";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password";
      }

      showNotification(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type = "success") => {
    Swal.fire({
      title: type === "success" ? "Success!" : "Error!",
      text: message,
      icon: type,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div>
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-tabs">
            <Link to="/user-dashboard" className="btn-primary back-btn">
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <button
              className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
              data-tab="personal"
              onClick={() => handleTabClick("personal")}
            >
              <i className="fas fa-user"></i> Personal Information
            </button>
            <button
              className={`tab-btn ${
                activeTab === "preferences" ? "active" : ""
              }`}
              data-tab="preferences"
              onClick={() => handleTabClick("preferences")}
            >
              <i className="fas fa-sliders-h"></i> Travel Preferences
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              data-tab="security"
              onClick={() => handleTabClick("security")}
            >
              <i className="fas fa-shield-alt"></i> Security
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeTab === "personal" && (
            <div className="profile-tab active" id="personal">
              <h2>Personal Information</h2>
              <br />
              <form
                className="profile-form"
                onSubmit={handlePersonalInfoSubmit}
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      defaultValue={userData.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      defaultValue={userData.email}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      defaultValue={userData.phone}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      defaultValue={userData.address}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      defaultValue={userData.city}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="country"
                      className="form-input"
                      defaultValue={userData.country}
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="profile-tab" id="preferences">
              <h2>Travel Preferences</h2>
              <br />
              <form className="profile-form" onSubmit={handlePreferencesSubmit}>
                <div className="preferences-grid">
                  <div className="preference-card">
                    <h3>Travel Style</h3>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="travelStyle"
                          value="adventure"
                          defaultChecked={userData.travelPreferences?.travelStyle?.includes(
                            "adventure"
                          )}
                        />{" "}
                        Adventure
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="travelStyle"
                          value="cultural"
                          defaultChecked={userData.travelPreferences?.travelStyle?.includes(
                            "cultural"
                          )}
                        />{" "}
                        Cultural
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="travelStyle"
                          value="luxury"
                          defaultChecked={userData.travelPreferences?.travelStyle?.includes(
                            "luxury"
                          )}
                        />{" "}
                        Luxury
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="travelStyle"
                          value="beach"
                          defaultChecked={userData.travelPreferences?.travelStyle?.includes(
                            "beach"
                          )}
                        />{" "}
                        Beach
                      </label>
                    </div>
                  </div>

                  <div className="preference-card">
                    <h3>Accommodation</h3>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="accommodation"
                          value="luxury"
                          defaultChecked={
                            userData.travelPreferences?.accommodation ===
                            "luxury"
                          }
                        />{" "}
                        Luxury Hotels
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="accommodation"
                          value="boutique"
                          defaultChecked={
                            userData.travelPreferences?.accommodation ===
                            "boutique"
                          }
                        />{" "}
                        Boutique Hotels
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="accommodation"
                          value="budget"
                          defaultChecked={
                            userData.travelPreferences?.accommodation ===
                            "budget"
                          }
                        />{" "}
                        Budget-Friendly
                      </label>
                    </div>
                  </div>

                  <div className="preference-card">
                    <h3>Dietary Requirements</h3>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="dietaryRequirements"
                          value="vegetarian"
                          defaultChecked={userData.travelPreferences?.dietaryRequirements?.includes(
                            "vegetarian"
                          )}
                        />{" "}
                        Vegetarian
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="dietaryRequirements"
                          value="vegan"
                          defaultChecked={userData.travelPreferences?.dietaryRequirements?.includes(
                            "vegan"
                          )}
                        />{" "}
                        Vegan
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="dietaryRequirements"
                          value="gluten-free"
                          defaultChecked={userData.travelPreferences?.dietaryRequirements?.includes(
                            "gluten-free"
                          )}
                        />{" "}
                        Gluten-Free
                      </label>
                    </div>
                  </div>

                  <div className="preference-card">
                    <h3>Special Assistance</h3>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="specialAssistance"
                          value="wheelchair"
                          defaultChecked={userData.travelPreferences?.specialAssistance?.includes(
                            "wheelchair"
                          )}
                        />{" "}
                        Wheelchair Access
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="specialAssistance"
                          value="transfer"
                          defaultChecked={userData.travelPreferences?.specialAssistance?.includes(
                            "transfer"
                          )}
                        />{" "}
                        Airport Transfer
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-tab" id="security">
              <h2>Security Settings</h2>
              <br />
              <div className="">
                <form className="profile-form" onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary save-btn"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
