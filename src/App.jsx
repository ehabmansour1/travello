import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Tours from "./pages/Tours/Tours";
import Wishlist from "./pages/WishList/WishList";
import Header from "./components/Header/Header";
import Booking from "./pages/Booking/Booking";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Payment from "./pages/Payment/Payment";
import TourDetails from "./pages/TourDetails/TourDetails";
import ContactUs from "./pages/ContactUs/ContactUs";
import LiveChat from "./pages/LiveChat/LiveChat";
import UserProfile from "./pages/UserProfile/UserProfile";

import HelpCenter from "./pages/HelpCenter/HelpCenter";


import Blogs from "./pages/Blogs/Blogs";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import TermsAndPrivacy from "./pages/TermsAndPrivacy/TeemsAndPrivacy";
import NotFound from "./pages/NotFoundPage/NotFoundPage";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/liveChat" element={<LiveChat />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/Terms" element={<TermsAndPrivacy/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
