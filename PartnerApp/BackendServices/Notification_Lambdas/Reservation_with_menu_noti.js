import AWS from 'aws-sdk';

const sns = new AWS.SNS();
const snsTopicArn = 'arn:aws:sns:us-east-1:951684160274:newRestaurantSignup';


export const handler = async (event, context) => {
  try {
    const email ="riyapatel3667@gmail.com"
    
    const loginSuccessMessage = 'New Reservation is booked with menu.';
      const snsLoginSuccessParams = {
        Message: loginSuccessMessage,
        Subject: "Reservation success",
        TopicArn: snsTopicArn,
        MessageAttributes: {  
          email: {
            DataType: "String",
            StringValue: email,
          },
        },
      }
      await sns.publish(snsLoginSuccessParams).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Reservation successful",
        }),
      };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};