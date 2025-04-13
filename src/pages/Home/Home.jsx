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
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../firebase";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    text: "An incredible experience! The tour was perfectly organized.",
  },
  {
    id: 2,
    name: "Mike Wilson",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    text: "Best vacation of my life. Will definitely book again!",
  },
];

const Home = () => {
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    guests: "2 Adults",
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [tours, setTours] = useState([]);
  const [setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursCollection = collection(db, "tours");
        const q = query(toursCollection, limit(3));
        const tourSnapshot = await getDocs(q);
        const tourList = tourSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTours(tourList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setLoading(false);
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
    console.log("Search data:", searchData);
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
      <FeaturedTours tours={tours} />
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
