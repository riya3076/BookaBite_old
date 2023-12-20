import React from "react";
import Router from "./Routes";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import Login from "./auth/login";
import Signup from "./auth/signup";
import Chatbot from "./views/Chatbot";
import NavbarLayout from "./utils/NavbarLayout";
import RestaurantDetails from "./list-restaurant/RestaurantDetails";
import RestaurantList from "./list-restaurant/RestaurantList";
import "./list-restaurant/styles.css";
import ViewReservation from "./views/Reservation/viewReservation";


import Slots from "./views/Reservation/checkAvailability";
export function isLoggedIn() {
  const token = localStorage.getItem("userData");
  return token !== null;
}

export function Auth({ children }) {
  return isLoggedIn() ? children : null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Router/>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
