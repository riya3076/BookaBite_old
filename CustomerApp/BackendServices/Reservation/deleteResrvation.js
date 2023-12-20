const admin = require("firebase-admin");
const functions = require("@google-cloud/functions-framework");
const cors = require("cors");

// Initialize the Firebase Admin SDK with your credentials file
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const reservationsRef = db.collection('Reservation'); // Corrected to 'Reservation' as in your working code

// Function to wrap processRequest with CORS handling
const wrappedProcessRequest = (req, res) => {
    cors()(req, res, () => {
        processRequest(req, res);
    });
};

const processRequest = async (req, res) => {
    try {
        // Check if reservation ID is provided
        const reservationId = req.body.reservation_id;
        if (!reservationId) {
            return res.status(400).json({ error: 'reservation_id is required' });
        }

        // Parse reservation ID to integer if it's supposed to be a number
        const parsedId = parseInt(reservationId);

        // Check if parsing was successful (parsedId is not NaN)
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: 'Invalid reservation_id format' });
        }

        // Query for the reservation with the parsed reservation_id
        const querySnapshot = await reservationsRef.where('reservation_id', '==', parsedId).get();
        
        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Assuming only one document matches the query, retrieve its document reference and delete it
        const docRef = querySnapshot.docs[0].ref;
        await docRef.delete();
        
        return res.status(200).json({ message: 'Reservation deleted successfully' });

    } catch (error) {
        console.error('Error deleting reservation:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Register the function with the Functions Framework
functions.http("deleteReservation", wrappedProcessRequest);