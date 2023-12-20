import boto3
import json

def lambda_handler(event, context):
    # Initialize a DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    
    
    table = dynamodb.Table('restaurants')

    # Scan the table for all items (this is okay for small tables but consider using Query for larger tables)
    response = table.scan()

    # Extract the restaurant names from the items
    restaurant_names = [item['restaurant_name'] for item in response.get('Items', [])]

    # Format the names into a single string message
    names_message = "Available Restaurants:\n" + "\n".join(restaurant_names)

    # Return the formatted message for the chatbot
    return {
        "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
                "contentType": "PlainText",
                "content": names_message
            }
        }
    }

