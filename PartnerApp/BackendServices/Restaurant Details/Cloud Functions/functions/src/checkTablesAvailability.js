const admin = require("firebase-admin");
const functions = require("firebase-functions");
const cors = require("cors");
const functionsCloud = require("@google-cloud/functions-framework");
const axios = require("axios");
const db = admin.firestore();

const checkTablesAvailability = functions.https.onRequest(async (req, res) => {
  // Parse the request body
  const requestBody = req.body;
  console.log(requestBody);
  const { restaurantId, reservationTimestamp } = requestBody;

  // Make a request to the API to get the number of tables for the given restaurant
  try {
    const apiResponse = await axios.get(
      `https://8z105mqfu7.execute-api.us-east-1.amazonaws.com/dev/getTotalTables?restaurantId=${restaurantId}`
    );

    const numberOfTables = apiResponse.data.total_tables;
    console.log("Here is the data::");
    console.log(apiResponse);
    console.log(apiResponse.data);
    console.log(apiResponse.data.total_tables);
    // Reference to the reservations collection in Firestore
    const reservationsRef = db.collection("reservation");
    console.log("condition reservation timestamp is::");
    console.log(reservationTimestamp);

    try {
      // Query the reservations collection for the specified date and restaurant
      const result = await reservationsRef
        .where("restaurant_id", "==", restaurantId)
        .where("reservation_status", "==", "confirm")
        .get();

      console.log(result.size);
      console.log(result);

      // Check if the reservation_timestamp matches the one from the request
      var counter = 0;

      result.forEach((doc) => {
        const reservationDocTimestamp = doc.data().reservation_timestamp;

        // Check if the timestamps match
        if (reservationDocTimestamp === reservationTimestamp) {
          counter++;
        }
      });

      // Calculate the number of available tables
      const availableTables = numberOfTables - counter;

      // Determine if the tables are full or not based on the timestamp condition
      const isFull = availableTables <= 0;

      // Prepare the response
      const response = {
        statusCode: 200,
        body: {
          isFull,
          availableTables,
        },
      };

      // Return the response
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error("Error querying the database:", error);

      // Prepare an error response
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
        }),
      };
    }
  } catch (error) {
    console.error("Error fetching number of tables from API:", error);

    // Prepare an error response
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
      }),
    };
    // Return the error response
    res.status(response.statusCode).json(response.body);
  }
});

// Function to wrap checkTablesAvailability with CORS handling
const wrappedCheckTablesAvailability = (req, res) => {
  cors()(req, res, () => {
    checkTablesAvailability(req, res);
  });
};

exports.handler = wrappedCheckTablesAvailability;

// Register the cloud function
functionsCloud.http("checkTablesAvailability", wrappedCheckTablesAvailability);
