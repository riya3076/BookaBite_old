import React from "react";
import "./styles.css";

/**
 * Functional component to display the top restaurants.
 * This component renders an iframe embedding a report from Google Looker Studio.
 * The report is expected to showcase information about top restaurants.
 */
function TopRestaurants() {
  return (
    <div className="App">
        <h2>
            <br></br>
        </h2>
      <header className="TopRestaurants-header">
        {/* iframe to embed the Google Looker Studio report */}
         <iframe 
         width="900" 
         height="750" 
         src="https://lookerstudio.google.com/embed/reporting/43d91b72-7bb2-4cae-9bbe-5cf635d1eaa8/page/nK5jD" 
         frameborder="0" 
         style={{ border: 0 }} 
         allowfullscreen>

         </iframe>
      </header>
    </div>
  );
}

export default TopRestaurants;