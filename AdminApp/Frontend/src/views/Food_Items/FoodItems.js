import React from 'react'

const FoodItems = () => {
//Function created for The top 10 food items ordered across restaurants
    const headingStyle = {
        textAlign: 'center',
        color: 'blue',       
        fontSize: '24px',     
        fontWeight: 'bold',   
      };


  return (
    <div className="FoodItems">
    <h1 style={headingStyle}>Top 10 Food Items</h1>
      <header className="FoodItems-header">
        
        <iframe width="1400" height="550" src="https://lookerstudio.google.com/embed/reporting/614421cd-3a9c-48b5-9357-b5c8ee315c96/page/HJ5jD" 
        frameborder="0" style={{border:0}} allowfullscreen></iframe>
      </header>
    </div>
    
  )
}

export default FoodItems