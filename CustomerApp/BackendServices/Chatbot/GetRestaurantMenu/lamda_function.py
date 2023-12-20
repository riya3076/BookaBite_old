import json

def lambda_handler(event, context):
    # Retrieve the session attributes from the Lex event
    session_attributes = event['sessionAttributes']
    
    # Retrieve the RestaurantName from the session attributes
    restaurant_name = session_attributes.get('restaurantName').lower()

    
    
    menu_items = fetch_menu_items(restaurant_name)

    print(restaurant_name)
    print(menu_items)
    # Create response message with menu items as buttons
    response_message = "Here are the menu items:\n"
    # response_message += "\n".join([f"{index + 1}) {item}" for index, item in enumerate(menu_items)])
    response_message = menu_items.join()
    
    print(response_message)
    # Create a list of button values (can be the menu item names)
    button_values = menu_items

    # Create the Lex response with buttons
    lex_response = {
        "sessionAttributes": session_attributes,
        "dialogAction": {
            "type": "ElicitSlot",
            "fulfillmentState": "InProgress",
            "message": {
                "contentType": "PlainText",
                "content": response_message
            },
            "intentName": "OrderFoodIntent",
            "slots": {},  # No additional slots to elicit
            "responseCard": {
                "version": 1,
                "contentType": "application/vnd.amazonaws.card.generic",
                "genericAttachments": [
                    {
                        "title": "Menu Items",
                        "buttons": [
                            {
                                "text": item,
                                "value": item
                            }
                            for item in button_values
                        ]
                    }
                ]
            }
        }
    }
    print(lex_response)
    return lex_response

# Replace this with your actual data retrieval logic
def fetch_menu_items(restaurant_name):
    # Example: Fetch menu items based on restaurant_name from your data source
    # Replace with your actual data retrieval logic
    if restaurant_name == "taj":
        return ["Burger", "Pizza", "Pasta"]
    elif restaurant_name == "marriot":
        return ["Sushi", "Steak", "Salad"]
    else:
        return []  # Empty list if restaurant not found
