import json

def get_opening_times():
    # Replace this with your actual logic to retrieve opening times
    # This is just a placeholder example
    opening_times = {
        "Monday": "9:00 AM - 5:00 PM",
        "Tuesday": "9:00 AM - 5:00 PM",
        "Wednesday": "9:00 AM - 5:00 PM",
        "Thursday": "9:00 AM - 8:00 PM",
        "Friday": "9:00 AM - 8:00 PM",
        "Saturday": "10:00 AM - 4:00 PM",
        "Sunday": "Closed",
    }
    return opening_times

def lambda_handler(event, context):
    try:
        # Replace this with your actual logic to retrieve opening times
        opening_times = get_opening_times()

        # Prepare the response
        response = {
            "sessionAttributes": event['sessionAttributes'],
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": f"Opening times:\n{json.dumps(opening_times, indent=2)}"
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
