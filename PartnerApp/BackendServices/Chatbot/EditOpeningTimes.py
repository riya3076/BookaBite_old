import json

def edit_opening_times(new_opening_times):
    # Replace this with your actual logic to edit opening times
    # This is just a placeholder example
    # Assume new_opening_times is a string like "9:00 AM - 6:00 PM"
    updated_opening_times = new_opening_times
    return updated_opening_times

def lambda_handler(event, context):
    try:
        # Extract necessary information from the Lex event
        new_opening_times = event['currentIntent']['slots']['NewOpeningTimes']
        # Assuming NewOpeningTimes is a required slot for this intent

        # Replace this with your actual logic to edit opening times
        updated_opening_times = edit_opening_times(new_opening_times)

        # Prepare the response
        response = {
            "sessionAttributes": event['sessionAttributes'],
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": f"Opening times updated to: {updated_opening_times}"
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
