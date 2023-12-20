import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function MenuReservationApp() {
  const userId = localStorage.getItem('user_id');
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const reservationData = location.state?.reservationData || {};
  const [restaurantEmail, setRestaurantEmail] = useState('');
  const restaurant = location.state?.restaurant || JSON.parse(localStorage.getItem('checkAvailability_restaurant'));

  useEffect(() => {
    // Axios call on page load
    axios
      .post('https://prb29cpvt2.execute-api.us-east-1.amazonaws.com/dev/get-menu', {
        restaurant_id: reservationData['restaurant_id'],
      })
      .then((response) => {
        // Assuming the response data is an array of menu items
        setMenuItems(response.data.body.restaurant_food_menu);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching menu items:', error);
      });
  }, []);

  // Basic theme setup using MUI v5
  const theme = createTheme({
    palette: {
      mode: 'light', // Set 'dark' if you want a dark theme
    },
  });

  const isEntireMenuOffer =
    menuItems.length > 0 && menuItems[0].menu_offer !== undefined;

  const getNonSlashedPrice = (item) => {
    return {
      regularPrice: item.menu_price,
      discountedPrice: Math.round((item.menu_price / 1.1) * 100) / 100,
    };
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    newQuantity = Number.isNaN(newQuantity) || newQuantity < 0 ? 0 : newQuantity;

    setMenuItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      return updatedItems;
    });
  };

  const fetchRestaurantEmail = () => {
    const restaurantId = restaurant.restaurant_id;
    
    axios.post('https://xam0fmzd13.execute-api.us-east-1.amazonaws.com/prod/getRestaurantEmail', {
      restaurantId: restaurantId
    })
    .then(response => {
      const  email  = response.data.email;
      console.log(response);
      console.log(email);
      setRestaurantEmail(email);
    })
    .catch(error => {
      console.error('Error fetching restaurant email:', error);
    });
  };

  const handleEditItem = (itemId) =>{
    //Here we are storing the selected item ID
    setSelectedItemId(itemId);
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: 0 } : item
      );
      return updatedItems;
    });
  };

  const handleAddToCart = async () => {
    const selectedItems = menuItems.filter((item) => item.quantity > 0);
    console.log('Selected items:', selectedItems);

    console.log(reservationData['reservation_id']);
    const updatedData = {
      id: reservationData['reservation_id'],
      food_reservation: selectedItems,
      updated_by: userId,
      updated_date: new Date().toISOString(),
    };
 
   const restaurantId = restaurant.restaurant_id;
    
   axios.post('https://xam0fmzd13.execute-api.us-east-1.amazonaws.com/prod/getRestaurantEmail', {
     restaurantId: restaurantId
   })
   .then(response => {
     const  email  = response.data.email;
     console.log(response);
     console.log(email);
     setRestaurantEmail(email);
     const foodReservationArray = selectedItems.map(({ menu_item_name, quantity }) => ({
      name: menu_item_name,
      quantity,
    }));
    console.log('Food reservation array:', foodReservationArray);
    const reservationData=JSON.parse(localStorage.getItem("mail_reservation_data"));
    const emailData = {
      email: email,
      reservation_id: restaurant.restaurant_id,
    no_of_tables: reservationData.no_of_tables,
    reservation_timestamp:reservationData.reservation_timestamp,
    food_reservation: foodReservationArray,
    };
    const foodReservationString = emailData.food_reservation
  .map(item => `name: ${item.name}, quantity: ${item.quantity}`)
  .join(', ');
  emailData.food_reservation = foodReservationString;
      console.log(JSON.stringify(emailData));
      console.log(emailData);
      axios.post(
        'https://xam0fmzd13.execute-api.us-east-1.amazonaws.com/prod/addreservation',
        JSON.stringify(emailData)
      ).then((response)=>{
        console.log(response);
        if (response.status === 200) {
          alert('Reservation added successfully!');
        } else {
          alert('Failed to add reservation: ' + (response.data.error || 'Unknown error'));
        }
      })
   })
   .catch(error => {
     console.error('Error fetching restaurant email:', error);
   });
    
    try {
      console.log(JSON.stringify(updatedData));
      const response = await fetch(
        'https://us-central1-serverless-402614.cloudfunctions.net/updateReservation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert('Reservation updated successfully!');
      } else {
        alert('Failed to update reservation: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating reservation: ' + error.message);
    }

    setMenuItems((prevItems) =>
      prevItems.map((item) => ({ ...item, quantity: 0 }))
    );
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <ThemeProvider theme={theme}>
      <Container className="mt-5">
        <h1 className="text-center">Restaurant Menu</h1>
        {isEntireMenuOffer && (
          <div className="text-center">
            <h3>Special Offer: 20% off on the entire menu!</h3>
          </div>
        )}
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-center">{category}</h2>
            <Grid container spacing={3}>
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Grid key={item.id} item xs={12} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        alt={item.menu_category}
                        height="140"
                        image={item.menu_image}
                      />
                      <CardContent>
                        <h5>{item.menu_category}</h5>
                        {isEntireMenuOffer && (
                          <>
                            <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                              ${getNonSlashedPrice(item).regularPrice}
                            </p>
                            <p style={{ fontWeight: 'bold', color: 'red' }}>
                              ${getNonSlashedPrice(item).discountedPrice}
                            </p>
                          </>
                        )}
                        {!isEntireMenuOffer && <p>${item.menu_price}</p>}
                        <p>Ingredients: {item.menu_ingrediants}</p>
                        <p>Discount: {item.menu_offer}</p>
                        <p>
                          Availability:{' '}
                          {item.menu_item_availability === 'available'
                            ? 'Available'
                            : 'Unavailable'}
                        </p>
                        {item.menu_item_availability === 'available' && (
                          <div className="text-center">
                            <span style={{ margin: '0 50px' }}></span>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        )}
                        {item.menu_item_availability === 'available' && (
                          <div>
                            <span style={{ margin: '0 0px' }}></span>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Delete
                            </Button>
                            <span style={{ margin: '0 90px' }}></span>
                          
                            <Button
                              variant="contained"
                              color="primary"
                        
                              onClick={() => handleEditItem(item.id)}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </div>
        ))}
        <div className="text-center mt-4">
        <span style={{ margin: '0 210px' }}></span>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
          >
            Click Here To Submit Reservation
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default MenuReservationApp;
