import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({  });

export async function handler(event) {
  console.log("Event received:", event);

  // When using Lambda proxy integration, event.body is a string.
  // Parsing it as JSON to get the actual body of the POST request.
  const body = JSON.parse(event.body);
   const {
    restaurant_id,
    restaurant_name,
    restaurant_location,
    img_url
  } = body; // Now we're destructuring from body, which is the parsed JSON of the event body

  console.log("Details:", restaurant_id, restaurant_name, restaurant_location, img_url);

  const params = {
    TableName: "restaurants",
    Item: {
      restaurant_id: { S: restaurant_id },
      restaurant_name: { S: restaurant_name },
      restaurant_location: { S: restaurant_location },
      img_url: { S: img_url }
    }
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (error) {
    console.error(error);
    return { headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow all domains
      "Access-Control-Allow-Headers": "Content-Type", 
      "Access-Control-Allow-Methods": "OPTIONS,POST" // Methods allowed for CORS
    },statusCode: 500, body: JSON.stringify({ error: "Could not write to DynamoDB" }) };
  }
}
