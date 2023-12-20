import admin from 'firebase-admin';
import serviceAccount from "./serviceAccountKey.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const handler = async (event, context) => {
  try {
    const { email } = event;

    const usersCollection = admin.firestore().collection('users'); 
    
    const querySnapshot = await usersCollection.where('email', '==', email).get();
    
    if (querySnapshot.empty) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const userDoc = querySnapshot.docs[0];

    const userId = userDoc.id;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ user_id: userDoc.id }),
    };
  } catch (error) {
    console.error('Error:', error);
    console.log('Error Message:', error.message);
    return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
