import { useState } from "react";
import PaymentForm from "../../components/paymentForm/PaymentForm";
import TourDetails from "../../components/TourDetailsForm/TourDetails";
import TravelerForm from "../../components/travelerForm/TravelerForm";
import "./Booking.css";

export default function Booking() {
    const [step, setStep] = useState(1);

    const nextstep = () =>{
        if(step !== 3){
            setStep(step + 1)
        }
        console.log(step)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    const Prevstep = () =>{
        if(step !== 1){
            setStep(step - 1)
        }
        console.log(step)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    return(
        <>
            <div className="steps">
                <div>
                    <div className="lable-1">1</div>
                    <h3>Tour Details</h3>
                </div>
                <div className="line"></div>
                <div>
                    <div className={step>1 ? "lable-1" : "lable-2"}>2</div>
                    <h3>Traveler Info</h3>
                </div>
                <div className="line"></div>

                <div>
                    <div className={step>2 ? "lable-1" : "lable-2"}>3</div>
                    <h3>Payment</h3>
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <div className="details-form">
                    {
                        step ==1 ? <TourDetails/> :
                        step ==2 ? <TravelerForm/> :
                        step ==3 ? <PaymentForm/> : null
                    }
                    <button className={step==1 ?"hidden" :"btnPrev" } onClick={Prevstep}>Previos</button>
                    <button className="btnNext" onClick={nextstep}>{step==3 ? "Confirm Booking" :"Next" }</button>
                </div>
                <div className="booking-summary">
                    <div className="tour-preview">
                        <img src="https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b" alt="Tour Preview" />
                        <h3>Majestic Switzerland</h3>
                        <div className="tour-highlights">
                            <span><i className="fas fa-calendar"></i> 7 Days</span>
                            <span><i className="fas fa-users"></i> 2 Adults</span>
                            <span><i className="fas fa-map-marker-alt"></i> Zurich Start</span>
                        </div>
                    </div>

                    <div className="price-breakdown">
                        <h3>Price Breakdown</h3>
                        <div className="price-row">
                            <span>Tour Price (2 Adults)</span>
                            <span>$4,998</span>
                        </div>
                        <div className="price-row">
                            <span>Taxes & Fees</span>
                            <span>$199</span>
                        </div>
                        <div className="price-row total">
                            <span>Total</span>
                            <span>$5,197</span>
                        </div>
                    </div>

                    <div className="booking-policies">
                        <h3>Booking Policies</h3>
                        <ul>
                            <li>Free cancellation up to 30 days before departure</li>
                            <li>50% deposit required to secure booking</li>
                            <li>Final payment due 30 days before departure</li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </>
    )
}