import json
import boto3
from datetime import datetime

dynamodb = boto3.client('dynamodb')
table_name = 'Reviews'

def generate_timestamp():
    return datetime.utcnow().isoformat()

def lambda_handler(event, context):
    request_body = event
    # print(request_body)
    session_attributes = event.get('sessionAttributes', {})
    user_id = session_attributes.get('UserId', None)
    print("user_id:" + str(user_id))
    timestamp = generate_timestamp()
    # user_id = request_body.get('user_id')
    reservation_id = event["currentIntent"]["slots"]["reservationId"]
    restaurant_id = event["currentIntent"]["slots"]["restaurantId"]
    review = event["currentIntent"]["slots"]["review"]
    rating = event["currentIntent"]["slots"]["rating"]
    
    # food_rating = request_body.get('food_rating', {})
    # restaurant_id = request_body.get('reservation_id')

    item_id = f'{timestamp}_{user_id}'
    
    dynamo_item = {
        'id': {'S': item_id},
        'user_id': {'N': str(user_id)},
        'reservation_id':  {'N': str(reservation_id)},
        'restaurant_id': {'S': str(restaurant_id)},
        'review': {'S': review},
        'rating': {'N': str(rating)},
       
    }
    
    #  'food_rating': {
    #         'M': {
    #             'food_item': {'S': food_rating.get('food_item', '')},
    #             'food_review': {'S': food_rating.get('food_review', '')}
    #         }
    #     }
    print(dynamo_item)

    dynamodb.put_item(
        TableName=table_name,
        Item=dynamo_item
    )

    response = {
        "sessionAttributes": {},
        "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
                "contentType": "PlainText",
                "content": "Review successfully added!"
            },
        },
    }
    return response
    
    
