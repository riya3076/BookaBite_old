import AWS from 'aws-sdk';
import admin from 'firebase-admin';

import serviceAccount from "./serviceAccountKey.js";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sns = new AWS.SNS();
const snsTopicArn = 'arn:aws:sns:us-east-1:951684160274:newRestaurantSignup';

const userTableName = "users";
const lambdaFunctionName = "Reservation_With_Menu"; 

export const handler = async (event, context) => {
  try {
    const body = event.body ? JSON.parse(event.body) : event;

    const {
      email,
      reservation_id,
      no_of_tables,
      reservation_timestamp,
      food_reservation,
    } = body;
    console.log(food_reservation);

    const userRef = admin.firestore().collection(userTableName);
    const querySnapshot = await userRef.where('email', '==', email).get();
    if (querySnapshot.size > 0) {
      console.log('User found:', email);

      const reservationSuccessMessage = `New Reservation is booked.\nReservation ID: ${reservation_id}\nNumber of Tables: ${no_of_tables}\nReservation Time: ${reservation_timestamp} \n Food Items: ${food_reservation} `;
      
      console.log('Sending reservation success message:', reservationSuccessMessage);

      const snsreservationSuccessParams = {
        Message: reservationSuccessMessage,
        Subject: "New Reservation",
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
          food_reservation : {
            DataType: "String",
            StringValue: food_reservation,
          }
        },
      };

      await sns.publish(snsreservationSuccessParams).promise();
      console.log('Reservation success message sent.');

      // Schedule EventBridge rule to trigger Lambda one hour before reservation timestamp
      const eventBridge = new AWS.EventBridge();
      const reminderTime = new Date(reservation_timestamp).getTime() - 3600000; // One hour before
      const lambda = new AWS.Lambda();
      
      // Create the rule
      const ruleParams = {
        Name: `ReminderRule_${reservation_id}`,
        ScheduleExpression: `cron(${new Date(reminderTime).getUTCMinutes()} ${new Date(reminderTime).getUTCHours()} ${new Date(reminderTime).getUTCDate()} ${new Date(reminderTime).getUTCMonth() + 1} ? ${new Date(reminderTime).getUTCFullYear()})`,
        State: "ENABLED",
        Description: "Reminder rule for reservation",
      };
      
      console.log('Creating EventBridge rule:', ruleParams);

      const ruleResponse = await eventBridge.putRule(ruleParams).promise();
      console.log('EventBridge rule created:', ruleResponse);

      // Associate the target (Lambda function) with the rule
      const targetParams = {
        Rule: ruleResponse.RuleArn.split("/")[1], // Extract the rule name from the ARN
        Targets: [
          {
            Id: `ReminderTarget_${reservation_id}`,
            Arn: `arn:aws:lambda:us-east-1:951684160274:function:Reservation_With_Menu`,
          },
        ],
      };

      console.log('Associating Lambda function with EventBridge rule:', targetParams);

      await eventBridge.putTargets(targetParams).promise();
      console.log('Lambda function associated with EventBridge rule.');

      const ruleName = ruleResponse.RuleArn.split("/")[1];
      await lambda.addPermission({
        FunctionName: lambdaFunctionName,
        StatementId: `EventBridgeInvokePermission_${reservation_id}`,
        Action: 'lambda:InvokeFunction',
        Principal: 'events.amazonaws.com',
        SourceArn: `arn:aws:events:us-east-1:951684160274:rule/${ruleName}`,
      }).promise();

      console.log('Permission added for Lambda function.');

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "New Reservation added!",
        }),
      };
    } else {
      console.log('No document with the specified email found.');
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "No document with the specified email found",
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
