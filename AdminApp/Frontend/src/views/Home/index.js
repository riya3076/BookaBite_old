import React from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

import restaurantImage from "../../assets/restaurants.png";
import foodItemsImage from "../../assets/food-items.png";
import orderPeriodsImage from "../../assets/time-period.png";
import customersImage from "../../assets/customers.png";
import reviewsImage from "../../assets/review.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const tiles = [
    { title: "Top 10 Restaurants", image: restaurantImage, link: "/topRestaurant" },
    { title: "Top 10 Food Items", image: foodItemsImage, link: "/fooditems" },
    { title: "Top Order Periods", image: orderPeriodsImage, link: "/timeperiod" },
    {
      title: "Top 10 Customers",
      image: customersImage,
      link: "/CustomersDashboard",
    },
    {
      title: "Reviews & Rating Dashboard",
      image: reviewsImage,
      link: "/ReviewsDashboard",
    },
  ];

  const navigate = useNavigate();

  return (
    <Grid
      container
      spacing={2}
      style={{
        padding: "20px",
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {tiles.map((tile, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea
              onClick={() => {
                navigate(tile.link);
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={tile.image}
                alt={tile.title}
                style={{ objectFit: "contain" }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  textAlign={"center"}
                >
                  {tile.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
