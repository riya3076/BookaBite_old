import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./auth/login";
import Signup from "./auth/signup";
import Chatbot from "./views/Chatbot";
import NavbarLayout from "./utils/NavbarLayout";
import RestaurantDetails from "./list-restaurant/RestaurantDetails";
import RestaurantList from "./list-restaurant/RestaurantList";
import ViewReservation from "./views/Reservation/viewReservation";
import MenuReservationApp from "./views/menu/ReservationMenu";

import Slots from "./views/Reservation/checkAvailability";
import "./list-restaurant/styles.css";
import Footer from "./utils/Footer";

const Router = () => {
  const location = useLocation();

  return (
    <>
      {/* <NavbarLayout /> */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<NavbarLayout />}>
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/MenuReservation" element={<MenuReservationApp />} />
          <Route path="/restaurantList" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          {/* <Route path="/checkAvailability" Component={Slots} />
        <Route path="/viewReservation" Component={ViewReservation} />
        */}
          <Route path="/checkAvailability" element={<Slots />} />
          <Route path="/viewReservation" element={<ViewReservation />} />
        </Route>
      </Routes>
      {/* <Footer /> */}
    </>
  );
};

export default Router;
