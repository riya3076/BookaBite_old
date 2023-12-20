import json

def get_menu_availability():
    # Replace this with your actual logic to retrieve menu availability
    # This is just a placeholder example
    menu_availability = {
        "Monday": True,
        "Tuesday": True,
        "Wednesday": True,
        "Thursday": True,
        "Friday": True,
        "Saturday": False,
        "Sunday": False,
    }
    return menu_availability

def lambda_handler(event, context):
    try:
        # Replace this with your actual logic to retrieve menu availability
        menu_availability = get_menu_availability()

        # Prepare the response
        response = {
            "sessionAttributes": event['sessionAttributes'],
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": f"Menu availability:\n{json.dumps(menu_availability, indent=2)}"
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
