import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import FeaturedTours from "../../components/FeaturedTours/FeaturedTours";
import Testimonials from "../../components/Testimonials/Testimonials";
import BlogSection from "../../components/BlogSection/BlogSection";
import Footer from "../../components/Footer/Footer";
import ChatWidget from "../../components/ChatWidget/ChatWidget";
import "./Home.css";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import image1 from "../../assets/images/1.jpg";
import image2 from "../../assets/images/2.jpg";
import image3 from "../../assets/images/3.jpg";
import image4 from "../../assets/images/4.jpg";
import image5 from "../../assets/images/5.jpg";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Peter William",
    avatar: image1,
    rating: 4,
    text: "Great service and very friendly staff. Highly recommended!"
  },
  {
    id: 2,
    name: "Mohammed Ali",
    avatar: image2,
    rating: 5,
    text: "Everything was perfect from start to finish!"
  },
  {
    id: 3,
    name: "Ali Khalid",
    avatar: image3,
    rating: 4,
    text: "The experience was amazing, I will come back again."
  },
  {
    id: 4,
    name: "Lila Hussein",
    avatar: image4,
    rating: 5,
    text: "Best vacation of my life. Will definitely book again!"
  },
  {
    id: 5,
    name: "Salma Abdulrahman",
    avatar: image5,
    rating: 5,
    text: "Exceptional service and beautiful place!"
  }
];

const Home = () => {
  const [searchData, setSearchData] = useState({
    destination: "",
    price: "",
    category: "all"  // Changed default to match select
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, "tours");
        const tourSnapshot = await getDocs(toursCollection);
        const tourList = tourSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTours(tourList);
        setFilteredTours(tourList);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = tours.filter(tour => {
      const matchesDestination = !searchData.destination || 
        (tour.location?.toLowerCase().includes(searchData.destination.toLowerCase()) || 
         tour.title?.toLowerCase().includes(searchData.destination.toLowerCase()));
      
      const searchPrice = parseFloat(searchData.price);
      const tourPrice = parseFloat(tour.price);
      const matchesPrice = !searchData.price || (
        !isNaN(searchPrice) && !isNaN(tourPrice) && tourPrice <= searchPrice
      );
      
      const matchesCategory = searchData.category === "all" || 
        tour.category?.toLowerCase() === searchData.category.toLowerCase();
      
      return matchesDestination && matchesPrice && matchesCategory;
    });
    
    setFilteredTours(filtered);
    setIsSearched(true);
  };

  return (
    <div className="home">
      <div className="background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere secondary"></div>
      </div>
      <Hero
        searchData={searchData}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />
      <FeaturedTours tours={isSearched ? filteredTours : tours.slice(0, 3)} />
      <Testimonials
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
      />
      <BlogSection />
      <ChatWidget />
    </div>
  );
};

export default Home;
