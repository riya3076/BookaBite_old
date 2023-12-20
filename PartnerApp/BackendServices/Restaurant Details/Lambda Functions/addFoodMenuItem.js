const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const tableName = "restaurants";
const bucketName = "serverless-restaurant-menu-image";

module.exports.addFoodMenuItem = async (event) => {
  console.log(event);
  console.log("event:::body");
  console.log(event.body);
  const requestBody = JSON.parse(event.body);
  const restaurantId = requestBody.restaurant_id;
  const newFoodMenuItem = {
    ...requestBody.food_menu_item,
    item_id: generateItemId(),
  };

  if (!restaurantId || !newFoodMenuItem) {
    console.error(
      "Invalid input. Both restaurant_id and food_menu_item are required."
    );
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Invalid input. Both restaurant_id and food_menu_item are required.",
      }),
    };
  }

  try {
    // Upload image to S3
    const imageKey = `${restaurantId}-${newFoodMenuItem.menu_item_name.replace(
      " ",
      "-"
    )}.jpg`;
    const s3Params = {
      Bucket: bucketName,
      Key: imageKey,
      Body: Buffer.from(requestBody.image, "base64"),
    };

    const s3UploadResult = await s3.upload(s3Params).promise();
    const imageUrl = s3UploadResult.Location;

    newFoodMenuItem.menu_image = imageUrl;

    const getParams = {
      TableName: tableName,
      Key: {
        restaurant_id: restaurantId,
      },
    };

    const getResult = await dynamoDB.get(getParams).promise();
    const existingFoodMenuItems = getResult.Item?.restaurant_food_menu || [];

    // Add the new food menu item to the existing array
    existingFoodMenuItems.push(newFoodMenuItem);

    // Update the DynamoDB table with the modified array
    const updateParams = {
      TableName: tableName,
      Key: {
        restaurant_id: restaurantId,
      },
      UpdateExpression: "SET restaurant_food_menu = :menuItems",
      ExpressionAttributeValues: {
        ":menuItems": existingFoodMenuItems,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateResult = await dynamoDB.update(updateParams).promise();
    console.log("Food menu item added successfully:", updateResult);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Food menu item added successfully" }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error adding food menu item:", error);
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

// Function to generate a unique item_id
function generateItemId() {
  return Math.floor(Math.random() * 1000000); // You can use a more robust method to generate IDs
}
