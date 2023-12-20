import boto3
import base64
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    s3 = boto3.client('s3')
    restaurant_id = event['restaurant_id']
    restaurant_offers = event['restaurant_offers']    
    
    try:
        table = dynamodb.Table('restaurants')
        response = table.update_item(
            Key={'restaurant_id': restaurant_id},
            UpdateExpression='SET restaurant_offers = :offers',
            ExpressionAttributeValues={':offers': restaurant_offers},
            ReturnValues='UPDATED_NEW'
        )

        return {
            'statusCode': 200,
            'body': response
        }

    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': e.response['Error']['Message']
        }

