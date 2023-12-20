import AWS from 'aws-sdk';
import admin from 'firebase-admin';

import serviceAccount from "./serviceAccountKey.js";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const sns = new AWS.SNS();
const snsTopicArn = 'arn:aws:sns:us-east-1:951684160274:newRestaurantSignup';

const userTableName = "users";

export const handler = async (event, context) => {
  try {
    const { email } = JSON.parse(event.body);
    const userRef = admin.firestore().collection(userTableName);
    const querySnapshot = await userRef.where('email', '==', email).get();

  if (querySnapshot.size > 0) {
    // At least one document with the specified email exists
    querySnapshot.forEach((doc) => {
    });
    const modifyreservationSuccessMessage = `Reservation deleted!`;
      const snsmodifyreservationSuccessParams = {
        Message: modifyreservationSuccessMessage,
        Subject: "Reservation deleted",
        TopicArn: snsTopicArn,
        MessageAttributes: {  
          email: {
            DataType: "String",
            StringValue: email,
          },
        },
      };
      
      await sns.publish(snsmodifyreservationSuccessParams).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Reservation deleted!",
        }),
      };
    
  } else {
    
      console.log('No document with the specified email found.');
      return {
        statusCode: 201,
        body: JSON.stringify({
          message:
            "No document with the specified email found",
        }),
      };
  
}
   

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
