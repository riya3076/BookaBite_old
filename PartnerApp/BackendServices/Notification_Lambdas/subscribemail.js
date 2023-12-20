import AWS from 'aws-sdk';

const sns = new AWS.SNS();
const snsTopicArn = 'arn:aws:sns:us-east-1:951684160274:newRestaurantSignup'

export const handler = async (event, context) => {
  try{
  const { email } = JSON.parse(event.body);
  console.log(event.body);
    console.log(email);
    const subscribeParams = {
        Protocol: "email",
        TopicArn: snsTopicArn, 
        Endpoint: email,
        Attributes: {
          FilterPolicy: JSON.stringify({ email: [email] }),
        },
      };
      
      await sns.subscribe(subscribeParams).promise();

    
      console.log('No document with the specified email found.');
      const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    };
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message:
            "Signup successful. Please check your email for confirmation message.",
        }),
      };
  }
  catch (error) {
    console.error("Error:", error);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    };
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
