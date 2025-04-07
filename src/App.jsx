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
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
<<<<<<< HEAD
import Payment from "./pages/Payment/Payment";
=======
import TourDetails from "./pages/TourDetails/TourDetails";
>>>>>>> a2972d6c93c03ab69f16ee68d36704defd5a1341


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/payment" element={<Payment />} />

      </Routes>
    </Router>
  );
};

export default App;
