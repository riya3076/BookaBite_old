import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    table = dynamodb.Table('restaurants')  # Replace with your table name

    # Extracting restaurant name from Lex event
    # Assuming it's already in lowercase
    restaurant_name = event['currentIntent']['slots']['RestaurantName']
    print(restaurant_name)
    try:
        # Scan the entire table (inefficient for large tables)
        responseData = table.scan()
        print(responseData)
        # Find the first item where the restaurant name matches (case-insensitive)
        matched_item = next((item for item in responseData['Items'] if item['restaurant_name'].lower() == restaurant_name), None)
        print(matched_item)
        
        if matched_item:
            return build_response(matched_item)
        else:
            return build_response("No restaurants found with that name.", "Failed")

    except Exception as e:
        return build_response(f"Error: {str(e)}", "Failed")

def build_response(message, fulfillment_state="Fulfilled"):
    if isinstance(message, dict):
        
        # If message is a dictionary (item), format it as a string
        # formatted_message = "\n".join([f"{key}: {value}" for key, value in message.items()])
        
        restaurant_name = message.get('restaurant_name', 'N/A')
        location = message.get('restaurant_location', 'N/A')
        operation_details = message.get('restaurant_operation_details', [])
        menu_items = message.get('restaurant_food_menu', [])
    
        # Formatting the response
        formatted_message = f"Restaurant Name: {restaurant_name}\nLocation: {location}\n"
    
        # Adding operation details
        for day_info in operation_details:
            day = day_info.get('day', 'N/A')
            opening_time = day_info.get('opening_time', 'N/A')
            closing_time = day_info.get('closing_time', 'N/A')
            formatted_message += f"\n{day}: {opening_time} - {closing_time}"
    
        # Adding menu items
        formatted_message += "\n\nMenu Items:"
        for item in menu_items:
            item_name = item.get('menu_item_name', 'N/A')
            formatted_message += f"\n- {item_name}"
    
        
    else:
        formatted_message = message

    return {
        "dialogAction": {
            "type": "Close",
            "fulfillmentState": fulfillment_state,
            "message": {
                "contentType": "PlainText",
                "content": formatted_message
            }
        }
    }
