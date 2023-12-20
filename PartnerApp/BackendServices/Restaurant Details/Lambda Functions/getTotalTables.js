const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "restaurants";
const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};
module.exports.getTotalTables = async (event) => {
  const restaurantId = event.queryStringParameters.restaurantId;
  // const restaurantId = requestBody.restaurantId;
  console.log(event.queryStringParameters);
  if (!restaurantId) {
    console.error("Invalid input. restaurantId is required.");
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid input. restaurantId is required.",
      }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }

  // Fetch the restaurant details from DynamoDB
  const getParams = {
    TableName: tableName,
    Key: {
      restaurant_id: restaurantId,
    },
  };

  try {
    const getResult = await dynamoDB.get(getParams).promise();

    if (!getResult.Item) {
      console.error("Restaurant not found.");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Restaurant not found." }),
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      };
    }

    const totalTables = getResult.Item.restaurant_number_of_tables || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ total_tables: totalTables }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error retrieving total tables:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }
};
