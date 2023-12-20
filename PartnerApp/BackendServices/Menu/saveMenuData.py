import boto3
import base64
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    
    dynamodb = boto3.resource('dynamodb')
    s3 = boto3.client('s3')
    s3_bucket_name = 'restaurant-food-items'

    restaurant_id = event['restaurant_id']
    
    menu_data = event['menuData']
    image_updates = event.get('imageUpdates', [])

    if image_updates:
        for update in image_updates:
            menu_item_id = update['menu_item_id']
            menu_image_base64 = update['menu_image_base64']
            image_data = base64.b64decode(menu_image_base64.split(",")[1])
            menu_item_name = next((item['menu_item_name'] for item in menu_data if item['menu_item_id'] == menu_item_id), None)
            
            if menu_item_name:

                name = menu_item_name.replace(" ","-")
                s3_object_key = f"{restaurant_id}-{name}.jpg"
                
                s3.put_object(Bucket=s3_bucket_name, Key=s3_object_key, Body=image_data)

                image_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{s3_object_key}"

                for item in menu_data:
                    if item['menu_item_id'] == menu_item_id:
                        item['menu_image'] = image_url

    try:
        table = dynamodb.Table('restaurants')
        response = table.update_item(
            Key={'restaurant_id': restaurant_id},
            UpdateExpression='SET restaurant_food_menu = :menu',
            ExpressionAttributeValues={':menu': menu_data},
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
