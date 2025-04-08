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

// Tour data
const tours = [
  {
    id: 1,
    title: "Majestic Switzerland",
    image: "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b",
    price: 2499,
    rating: 4.9,
    duration: "7 days",
    description: "Experience the breathtaking Alps and pristine lakes",
  },
  {
    id: 2,
    title: "Thailand Paradise",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
    price: 1899,
    rating: 4.8,
    duration: "10 days",
    description: "Explore exotic beaches and ancient temples",
  },
  {
    id: 3,
    title: "Italian Dream",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
    price: 2199,
    rating: 4.9,
    duration: "8 days",
    description: "Discover art, history, and amazing cuisine",
  },
];

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
  const [newsletterEmail, setNewsletterEmail] = useState("");

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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", newsletterEmail);
    setNewsletterEmail("");
  };

  return (
    <div className="home">
      <div className="background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere secondary"></div>
      </div>

      <Header />
      
      <Hero
        searchData={searchData}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />
      <Link to={"/Payment"}>Payment</Link>

      <FeaturedTours tours={tours} />
      <Testimonials
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
      />
      <BlogSection blogPosts={blogPosts} />
      <ChatWidget />
      <Footer
        newsletterEmail={newsletterEmail}
        handleNewsletterSubmit={handleNewsletterSubmit}
        setNewsletterEmail={setNewsletterEmail}
      />
    </div>
  );
};

export default Home;
