import json

def lambda_handler(event, context):
    # Extract slot values from the Lex event
    slots = event['currentIntent']['slots']
    restaurant_name = slots['RestaurantName']
    email = slots['Email']
    date = slots['Date']
    time = slots['Time']
    
    # Set slot values as session attributes
    session_attributes = {
        "restaurantName": restaurant_name,
        "email": email,
        "date": date,
        "time": time
    }
    
    # Perform the reservation logic here (e.g., save to a database)
    # Replace this with your actual reservation logic
    
    # Generate a response message
    response_message = f"Thank you! Your reservation at {restaurant_name} on {date} at {time} has been confirmed."
    
    # Create a response JSON for Lex
    lex_response = {
        "sessionAttributes": session_attributes,  # Set session attributes
        "dialogAction": {
            "type": "Close",  # Indicates that the intent has been fulfilled
            "fulfillmentState": "Fulfilled",
            "message": {
                "contentType": "PlainText",
                "content": response_message
            },
            "responseCard": {
                "version": 1,
                "contentType": "application/vnd.amazonaws.card.generic",
                "genericAttachments": [
                    {
                        "title": "Order food with your reservation?",
                        "buttons": [
                            {
                                "text": "Yes",
                                "value": "Yes, I want to order food with my reservation."
                            },
                            {
                                "text": "No",
                                "value": "No, I don't want to order food with my reservation."
                            }
                        ]
                    }
                ]
            }
        }
    }
    
    return lex_response
