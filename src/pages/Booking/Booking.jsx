import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFirebase } from "../../contexts/FirebaseContext";
import TourDetails from "../../components/TourDetailsForm/TourDetails";
import TravelerForm from "../../components/TravelerForm/TravelerForm";
import Swal from "sweetalert2";
import "./Booking.css";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelerFormData, setTravelerFormData] = useState(null);
  const [specialRequests, setSpecialRequests] = useState("");
  const { user } = useFirebase();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourDoc = doc(db, "tours", id);
        const tourSnap = await getDoc(tourDoc);
        
        if (tourSnap.exists()) {
          setTour({ id: tourSnap.id, ...tourSnap.data() });
        } else {
          navigate('/tours');
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, navigate]);

  const handleTravelerFormDataChange = (data) => {
    setTravelerFormData(data);
  };

  const handleSpecialRequestsChange = (requests) => {
    setSpecialRequests(requests);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const bookingData = {
        tourId: tour.id,
        tourTitle: tour.title,
        userId: user.uid,
        numTravelers,
        totalPrice: tour.price * numTravelers,
        travelerInfo: travelerFormData,
        specialRequests,
        status: 'pending',
        createdAt: new Date(),
      };

      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, bookingData);

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: 'Your booking has been received. Please wait a call from admin to confirm your booking.',
        confirmButtonText: 'OK'
      });

      // Navigate to user dashboard
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while processing your booking. Please try again.',
      });
    }
  };

  const nextstep = () => {
    if (step === 2) {
      handleConfirmBooking();
    } else if (step !== 2) {
      setStep(step + 1);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const Prevstep = () => {
    if (step !== 1) {
      setStep(step - 1);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTravelersChange = (count) => {
    setNumTravelers(count);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return null;
  }

  return (
    <>
      <div className="steps">
        <div>
          <div className="lable-1">1</div>
          <h3>Tour Details</h3>
        </div>
        <div className="line"></div>
        <div>
          <div className={step > 1 ? "lable-1" : "lable-2"}>2</div>
          <h3>Traveler Info</h3>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="details-form">
          {step == 1 ? (
            <TourDetails 
              tour={tour} 
              numTravelers={numTravelers}
              onTravelersChange={handleTravelersChange}
              onSpecialRequestsChange={handleSpecialRequestsChange}
            />
          ) : step == 2 ? (
            <TravelerForm onFormDataChange={handleTravelerFormDataChange} />
          ) : null}
          <button
            className={step == 1 ? "hidden" : "btnPrev"}
            onClick={Prevstep}
          >
            Previous
          </button>
          <button className="btnNext" onClick={nextstep}>
            {step == 2 ? "Confirm Booking" : "Next"}
          </button>
        </div>
        <div className="booking-summary">
          <div className="tour-preview">
            <img
              src={tour.image}
              alt={tour.title}
            />
            <h3>{tour.title}</h3>
          </div>

          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            <div className="price-row">
              <span>Price per Person</span>
              <span>${tour.price}</span>
            </div>
            <div className="price-row">
              <span>Number of Travelers</span>
              <span>{numTravelers}</span>
            </div>
            <div className="price-row total">
              <span>Total Price</span>
              <span>${tour.price * numTravelers}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
