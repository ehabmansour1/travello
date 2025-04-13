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
import PaymentPage from "../Payment/Payment";
import Payment from "../Payment/Payment";
import { collection, getDocs, query, limit, where } from "firebase/firestore";
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

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Europe",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
    excerpt: "Discover unexplored destinations off the beaten path...",
  },
  {
    id: 2,
    title: "Travel Photography Tips",
    image: "https://images.unsplash.com/photo-1452796907770-ad6cd374b12d",
    excerpt: "Master the art of capturing your adventures...",
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

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursRef = collection(db, "tours");
        const q = query(
          toursRef,
          where("status", "==", "active"),
          limit(3)
        );
        const tourSnapshot = await getDocs(q);
        const tourList = tourSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTours(tourList);
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
    // Handle search logic here
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
      <BlogSection blogPosts={blogPosts} />
      <ChatWidget />

    </div>
  );
};

export default Home;
