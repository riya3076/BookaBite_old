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
    const reservationData = JSON.parse(event.body);
    const { email, reservation_id, no_of_tables, reservation_timestamp } = reservationData;
    
    const userRef = admin.firestore().collection(userTableName);
    const querySnapshot = await userRef.where('email', '==', email).get();

  if (querySnapshot.size > 0) {
    // At least one document with the specified email exists
    querySnapshot.forEach((doc) => {
    });
    const modifyreservationSuccessMessage = `Reservation modified! \nReservation ID: ${reservation_id}\nNumber of Tables: ${no_of_tables}\nReservation Time: ${reservation_timestamp}`;
      const snsmodifyreservationSuccessParams = {
        Message: modifyreservationSuccessMessage,
        Subject: "Reservation update",
        TopicArn: snsTopicArn,
        MessageAttributes: {  
          email: {
            DataType: "String",
            StringValue: email,
          },
          reservation_id: {
            DataType: "String",
            StringValue: reservation_id.toString(),
          },
          no_of_tables: {
            DataType: "String",
            StringValue: no_of_tables.toString(),
          },
          reservation_timestamp: {
            DataType: "String",
            StringValue: reservation_timestamp,
          },
        },
      };
      
      await sns.publish(snsmodifyreservationSuccessParams).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Reservation updated!",
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
