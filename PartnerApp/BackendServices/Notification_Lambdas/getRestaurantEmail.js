import pkg from 'aws-sdk';
const { DynamoDB } = pkg;
const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event) => {
    const restaurantId = event.restaurantId;

    if (!restaurantId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing restaurantId parameter' }),
        };
    }

    const params = {
        TableName: 'restaurants', 
        Key: {
            restaurant_id: restaurantId,
        },
    };

    try {
        const data = await dynamoDB.get(params).promise();

        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Restaurant not found' }),
            };
        }

        const restaurantEmail = data.Item.restaurant_email;

        return {
            statusCode: 200,
            body: JSON.stringify({ email: restaurantEmail }),
        };
    } catch (error) {
        console.error('Error retrieving restaurant data', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
