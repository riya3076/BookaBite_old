
const admin = require("firebase-admin");
const functions = require("@google-cloud/functions-framework");
const cors = require("cors");


// Initialize the Firebase Admin SDK with your credentials file
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Function to handle the request
const processRequest = async (req, res) => {
 
if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid request method' });
  }


  try {
    const db = admin.firestore();
    const newReservation = req.body;


    // Add a new reservation document to the "Reservation" collection
    const reservationsRef = db.collection('Reservation');
    const docRef = await reservationsRef.add(newReservation);

    
    return res.status(201).json({ message: 'Reservation added', id: docRef.id });
  } catch (error) {
    return res.status(500).json({ error: 'Error adding reservation' });
  }
};


// Function to wrap processRequest with CORS handling
const wrappedProcessRequest = (req, res) => {
  cors()(req, res, () => {
    processRequest(req, res);
  });
};


// Create a Google Cloud Function that listens to HTTP requests
functions.http("addReservation", wrappedProcessRequest);