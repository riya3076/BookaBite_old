const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const axios = require("axios");

// Lambda function to send restaurant offers
module.exports.sendRestaurantOffers = async (event) => {
  // Get the current time in HHMM format
  const currentADTtime = getCurrentTimeinHHMM();

  // Get the current day of the week
  const dayOfWeek = getTodaysDay();

  // Define DynamoDB scan parameters to retrieve restaurants with offers
  const params = {
    TableName: "restaurants",
    FilterExpression: "attribute_exists(offers)",
  };
  console.log("Reached here::2");

  try {
    // Scan the DynamoDB table to find restaurants with offers
    const data = await dynamodb.scan(params).promise();

    console.log("Reached here::3");

    // Filter the restaurants that are opening within the next hour
    const restaurants = data.Items.map((item) => {
      if (
        item.operating_days[dayOfWeek].opening_time <= currentADTtime + 100 &&
        item.operating_days[dayOfWeek].opening_time > currentADTtime
      ) {
        console.log("In here");
        return {
          restaurant_name: item.restaurant_name,
          offers: item.offers,
        };
      } else {
        console.log(
          "Your opening time is ::" +
            item.operating_days[dayOfWeek].opening_time
        );
      }
    });

    // Build the email body using restaurant information
    const emailBody = restaurants
      .map((restaurant) => {
        return `Restaurant Name: ${restaurant.restaurant_name}\nOffers: ${restaurant.offers}`;
      })
      .join("\n\n");

    console.log("Reached here::4");

    // Create email data with subject and body
    const emailData = {
      subject: "Latest Offers!!! Hurry, restaurants open in the next 1 hour",
      body: emailBody,
    };

    console.log("Reached here::5");

    // Send email notifications to all users
    await axios
      .post(
        "https://us-central1-serverless-402501.cloudfunctions.net/getAllUsers",
        emailData
      )
      .then((response) => {
        console.log("Users found successfully.");
        res.status(200).send("Latest offers sent to the users");
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        return res.status(500).send("Error fetching users");
      });
    console.log(restaurants);
  } catch (error) {
    console.log(error);

    // If an error occurs during the retrieval, return a 500 response
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while querying the database.",
      }),
    };
  }
};

// Function to get the current day of the week
function getTodaysDay() {
  const currentDate = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Get the day of the week as an integer (0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = currentDate.getDay();
  return dayOfWeek;
}

// Function to get the current time in HHMM format in Atlantic Daylight Time
function getCurrentTimeinHHMM() {
  const atlanticTimeZone = "America/Halifax"; // Time zone for Atlantic Daylight Time
  const options = {
    timeZone: atlanticTimeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  const now = new Date();
  const currentadtTime = parseInt(
    new Intl.DateTimeFormat("en-US", options).format(now).replace(":", ""),
    10
  );
  console.log("Current Atlantic Daylight Time (HHMM):", currentadtTime);
  return currentadtTime;
}
