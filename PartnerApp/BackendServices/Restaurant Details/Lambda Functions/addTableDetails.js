const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "restaurants";
const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};
module.exports.addTableDetails = async (event) => {
  const requestBody = JSON.parse(event.body);
  const restaurantId = requestBody.restaurant_id;
  const tableDetails = requestBody.table_details;
  console.log("Hey There!!");

  console.log(requestBody);

  if (!restaurantId || !tableDetails || typeof tableDetails !== "object") {
    console.error(
      "Invalid input. restaurant_id and table_details are required, and table_details must be an object."
    );
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Invalid input. restaurant_id and table_details are required, and table_details must be an object.",
      }),
    };
  }

  // Calculate total number of tables
  const totalTables = Object.values(tableDetails).reduce(
    (acc, current) => acc + current,
    0
  );

  // Fetch the existing restaurant details from DynamoDB
  const getParams = {
    TableName: tableName,
    Key: {
      restaurant_id: restaurantId,
    },
  };

  try {
    const getResult = await dynamoDB.get(getParams).promise();
    const existingRestaurantDetails = getResult.Item || {};

    // Update the DynamoDB table with the new fields
    const updateParams = {
      TableName: tableName,
      Key: {
        restaurant_id: restaurantId,
      },
      UpdateExpression:
        "SET restaurant_number_of_tables = :totalTables, restaurant_table_details = :tableDetails",
      ExpressionAttributeValues: {
        ":totalTables": totalTables,
        ":tableDetails": tableDetails,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateResult = await dynamoDB.update(updateParams).promise();
    console.log(
      "Total tables and table details added successfully:",
      updateResult
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Total tables and table details added successfully",
      }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error adding total tables and table details:", error);
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
