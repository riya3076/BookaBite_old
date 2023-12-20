const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const axios = require("axios");

// Lambda function to get the food menu for a specific restaurant
module.exports.getFoodMenuForRestaurants = async (event) => {
  // Extract the restaurant ID from the event object
  const restaurantId = event.restaurant_id;
  console.log("Reached here");

  // Define the parameters for the DynamoDB get operation
  const params = {
    TableName: "restaurants", // Replace with your DynamoDB table name
    Key: {
      restaurant_id: restaurantId,
    },
  };
  console.log("Reached here");

  try {
    // Retrieve restaurant data from DynamoDB
    const data = await dynamodb.get(params).promise();

    // If no data is found for the given restaurant ID, return a 404 response
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Restaurant not found" }),
      };
    }

    console.log("Reached here");

    // Extract the food menu items from the restaurant's data
    const foodMenu = data.Item.restaurant_food_menu.L;

    // Return a 200 response with the extracted food menu
    return {
      statusCode: 200,
      body: JSON.stringify({ foodMenu }),
    };
  } catch (error) {
    console.log(error);

    // If an error occurs during the retrieval, return a 500 response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving restaurant data" }),
    };
  }
};
