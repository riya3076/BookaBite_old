
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
    const reservationData = req.body;
    const reservationsRef = db.collection('Reservation');

    if (reservationData.id) {
        try {
          // Find the document that matches the reservation_id
          const snapshot = await reservationsRef.where("reservation_id", "==", reservationData.id).get();
          if (snapshot.empty) {
            return res.status(404).json({ error: 'No matching reservation found' });
          }
    
          // There should be only one matching document since reservation_id is unique
          const docRef = snapshot.docs[0].ref;
          delete reservationData.id; // Remove the id field from the update payload
    
          await docRef.update(reservationData);
          return res.status(200).json({ message: 'Reservation updated', id: docRef.id });
    
        } catch (error) {
          return res.status(500).json({ error: 'Error updating reservation: ' + error.message });
        }
      } else {
        return res.status(400).json({ error: 'Reservation ID not provided' });
      }
    
  } catch (error) {
    return res.status(500).json({ error: 'Error processing reservation' });
  }
};


// Function to wrap processRequest with CORS handling
const wrappedProcessRequest = (req, res) => {
  cors()(req, res, () => {
    processRequest(req, res);
  });
};

// Create a Google Cloud Function that listens to HTTP requests
functions.http("updateReservation", wrappedProcessRequest);