import json
from datetime import datetime

def get_booking_info(date):
    # Replace this with your actual logic to retrieve booking information
    # This is just a placeholder example
    if datetime.now().date() == date:
        return "Booking information for today."
    else:
        return "No bookings available for the specified date."

def lambda_handler(event, context):
    try:
        # Extract necessary information from the Lex event
        date_slot = event['currentIntent']['slots']['Date']
        # Assuming Date is a required slot for this intent

        # Parse the date string into a datetime object
        date = datetime.strptime(date_slot, '%Y-%m-%d').date()

        # Get booking information based on the date
        booking_info = get_booking_info(date)

        # Prepare the response
        response = {
            "sessionAttributes": event['sessionAttributes'],
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": booking_info
                },
            },
        }

        return response

    except Exception as e:
        # Handle errors and return an appropriate response
        error_response = {
            "sessionAttributes": event['sessionAttributes'],
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Failed",
                "message": {
                    "contentType": "PlainText",
                    "content": f"An error occurred: {str(e)}"
                },
            },
        }

        return error_response
