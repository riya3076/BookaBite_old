import React, { useState } from "react";
import "./AddMenuItemForm.css"; // Import a CSS file for styling (create this file if it doesn't exist)

const AddMenuItemForm = () => {
  const [menuCategory, setMenuCategory] = useState("");
  const [menuIngredients, setMenuIngredients] = useState("");
  const [availability, setAvailability] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemOffer, setItemOffer] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [image, setImage] = useState(null);
  const restaurantId = localStorage.getItem("restaurant_id");
  const apiUrl =
    "https://oblbtb4rq7.execute-api.us-east-1.amazonaws.com/dev/addFoodMenuItem";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];

      // Create a JSON object to send
      const data = {
        restaurant_id: restaurantId, // Using a static restaurant ID
        food_menu_item: {
          menu_category: menuCategory,
          menu_ingrediants: menuIngredients,
          menu_item_availability: availability,
          menu_item_name: itemName,
          menu_offer: itemOffer,
          menu_price: itemPrice,
        },
        image: base64Data,
      };

      // Make a POST request to the API endpoint with JSON data
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((responseData) => {
          // Handle the response from the server as needed
          alert("MenuItem added successfully:", responseData);
          // You can also perform additional actions here, such as updating the UI
        })
        .catch((error) => {
          console.error("Error adding MenuItem:", error);
        });
    };

    // Read the image file as a data URL
    reader.readAsDataURL(image);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-row">
        <label>
          Menu Category:
          <input
            type="text"
            value={menuCategory}
            onChange={(e) => setMenuCategory(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Ingredients:
          <textarea
            value={menuIngredients}
            onChange={(e) => setMenuIngredients(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Availability:
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Item Name:
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </label>

        <label>
          Item Offer:
          <input
            type="text"
            value={itemOffer}
            onChange={(e) => setItemOffer(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Item Price:
          <input
            type="text"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      <div className="form-row">
        <button type="submit">Add Menu Item</button>
      </div>
    </form>
  );
};

export default AddMenuItemForm;
