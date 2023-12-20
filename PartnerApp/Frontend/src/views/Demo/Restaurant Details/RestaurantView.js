import React, { useState, useEffect } from "react";
import "./RestaurantView.css";
// import RestaurantAvailabilityForm from "./RestaurantAvailabilityForm";
import OperationCard from "./OperationCard";
const RestaurantView = () => {
  return (
    <>
      <div className="restaurant-container">
        <div className="restaurant-content">
          <h1>Tawa Grill Home Page</h1>
          <p></p>
        </div>
      </div>
      <div className="cardView">
        <OperationCard title="Availability" description="Custom Description" />
        <OperationCard
          title="Modify table Size"
          description="Custom Description"
        />
        <OperationCard title="" description="Custom Description" />
      </div>
    </>
  );
};

export default RestaurantView;
