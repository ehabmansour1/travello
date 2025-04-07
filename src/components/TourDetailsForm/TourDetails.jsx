import { useState } from "react";
import "./TourDetails.css";

export default function TourDetails() {
  const [Adults, setAdults] = useState(1);
  const [Children, setChildren] = useState(1);
    const [Infants, setInfants] = useState(1);

  return (
    <>
      <div className="main">
        <h1 style={{margin:"20px" , fontSize:"40px"}}>Tour Details</h1>

        {/* date of travel*/}

        <form action="">
          <label htmlFor="date">Tour Date</label>
          <select name="date" id="tour-date" className="tour-select">
            <option value="june 15, 2024">June 15, 2024</option>
            <option value="july 1, 2024">July 1, 2024</option>
            <option value="july 15, 2024">July 15, 2024</option>
          </select>
        </form>

        {/* Number of Travelers*/}

        <p style={{ marginTop: "30px" }}>Number of Travelers</p>
        <div>
          {/* adults */}
          <div className="travelers">
            <p>Adults (12+)</p>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => setAdults((prev) => prev - 1)}
                disabled={Adults <= 1}
                className="minus"
              >
                -
              </button>
              <p>{Adults}</p>
              <button onClick={() => setAdults((prev) => prev + 1)}>+</button>
            </div>
          </div>
            {/* children */}
          <div className="travelers">
            <p>Children (2-11)</p>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => setChildren((prev) => prev - 1)}
                disabled={Children <= 1}
                className="minus"
              >
                -
              </button>
              <p>{Children}</p>
              <button onClick={() => setChildren((prev) => prev + 1)}>+</button>
            </div>
          </div>

          <div className="travelers">
            <p>Infants (0-2)</p>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => setInfants((prev) => prev - 1)}
                disabled={Infants <= 1}
                className="minus"
              >
                -
              </button>
              <p>{Infants}</p>
              <button onClick={() => setInfants((prev) => prev + 1)}>+</button>
            </div>
          </div>
        </div>


        {/* Special Requests */}
        <div>
            <p style={{marginBottom:"20px"}}>Special Requirements</p>
            <textarea className="form-input" placeholder="Please let us know if you have any special requirements or requests.">
            </textarea>
        </div>
      </div>
    </>
  );
}
