import { useState } from "react";
import "./TourDetails.css";

export default function TourDetails({ tour, numTravelers, onTravelersChange, onSpecialRequestsChange }) {
  const [specialRequests, setSpecialRequests] = useState("");

  const handleTravelersChange = (change) => {
    const newValue = numTravelers + change;
    if (newValue >= 1 && newValue <= (tour?.maxGroupSize || 10)) {
      onTravelersChange(newValue);
    }
  };

  const handleSpecialRequestsChange = (e) => {
    setSpecialRequests(e.target.value);
    onSpecialRequestsChange(e.target.value);
  };

  return (
    <>
      <div className="main">
        <h1 style={{margin:"20px" , fontSize:"40px"}}>Tour Details</h1>

        {/* Number of Travelers*/}
        <div className="travelers-section">
          <p style={{ marginTop: "30px" }}>Number of Travelers</p>
          <div className="travelers">
            <p>Travelers</p>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => handleTravelersChange(-1)}
                disabled={numTravelers <= 1}
                className="minus"
              >
                -
              </button>
              <p>{numTravelers}</p>
              <button 
                onClick={() => handleTravelersChange(1)}
                disabled={numTravelers >= (tour?.maxGroupSize || 10)}
              >
                +
              </button>
            </div>
          </div>
          {numTravelers >= (tour?.maxGroupSize || 10) && (
            <p className="warning-text">Maximum group size reached</p>
          )}
        </div>

        {/* Special Requests */}
        <div>
          <p style={{marginBottom:"20px"}}>Special Requirements</p>
          <textarea 
            className="form-input" 
            placeholder="Please let us know if you have any special requirements or requests."
            value={specialRequests}
            onChange={handleSpecialRequestsChange}
          />
        </div>
      </div>
    </>
  );
}
