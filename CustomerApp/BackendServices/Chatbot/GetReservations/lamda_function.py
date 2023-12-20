import json
import requests

from datetime import datetime

def convert_to_readable_date(seconds):
    # Convert seconds to a datetime object
    dt = datetime.fromtimestamp(seconds)
    # Format the datetime object to a date string (e.g., "2023-12-10")
    formatted_date = dt.strftime("%Y-%m-%d")
    return formatted_date
    
    
def lambda_handler(event, context):
    
    session_attributes = event.get('sessionAttributes', {})
    user_id = session_attributes.get('UserId', None)
    print(user_id)
    # Your array of reservations
    # reservations = [
    #     {"reservation_id": 1, "restaurant_name": "Taj", "reservation_date": "2023-12-10", "restaurant_id": 1}
    #     # Add more reservations as needed
    # ]
    
    post_data = {"user_id": int(user_id)}

    # Making the POST request to the API
    # response = requests.post("https://us-central1-serverless-402501.cloudfunctions.net/getAllCompletedReservationsForCustomer", json=json.dumps(post_data))
    response = requests.post("https://us-central1-serverless-402501.cloudfunctions.net/getAllCompletedReservationsForCustomer", json=post_data)

    # Check if the request was successful
    if response.status_code == 200:
        print(type(response))
        data = response.json()
        print(data)
        print(type(data))
        print(data[0])
        reservations = response.json()
    else:
        # Handle errors or no reservations found
        return {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Failed',
                'message': {
                    'contentType': 'PlainText',
                    'content': 'Sorry, I couldn’t retrieve your reservations at this time.'
                }
            }
        }


    # Creating response cards based on the reservations
    response_cards = []
    for reservation in reservations:
        readable_date = convert_to_readable_date(reservation['reservation_time']['_seconds'])
        button_title = f"Reservation on {readable_date}"
        button_value = f"Write a review and rating for {reservation['reservation_id']} {reservation['restaurant_id']}"

        response_cards.append({
            'buttons': [
                {
                    'text': button_title,
                    'value': button_value
                }
            ]
        })

    # Formulating the Lambda response
    response = {
        'dialogAction': {
            'type': 'Close',  # Since it's the final fulfillment
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'Please select a reservation from the options below to rate:'
            },
            'responseCard': {
                'version': 1,
                'contentType': 'application/vnd.amazonaws.card.generic',
                'genericAttachments': response_cards
            }
        }
    }

    return response
