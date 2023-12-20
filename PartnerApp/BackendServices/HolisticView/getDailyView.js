const admin = require("firebase-admin");
const functions = require("@google-cloud/functions-framework");
const cors = require("cors");

// Initialize the Firebase Admin SDK with  credentials file
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to handle the request
const processRequest = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid request method, POST required.' });
  }

  try {
    const db = admin.firestore();
    const { restaurant_id } = req.body;

    if (!restaurant_id) {
      return res.status(400).json({ error: 'Restaurant_id is required' });
    }

    // Query the "Reservation" collection to get all reservations for the specified restaurant
    const reservationsRef = db.collection('Reservation');
    const querySnapshot = await reservationsRef.where('restaurant_id', '==', restaurant_id).get();

    let reservationsByDateAndTime = {};

    // Process each reservation
    querySnapshot.forEach(doc => {
      const reservation = doc.data();
      const [date, timeWithZ] = reservation.reservation_timestamp.split('T');
      const time = timeWithZ.split('Z')[0];

      if (!reservationsByDateAndTime[date]) {
        reservationsByDateAndTime[date] = {};
      }

      // Initialize the time slot with 0 tables if it doesn't exist
      if (!reservationsByDateAndTime[date][time]) {
        reservationsByDateAndTime[date][time] = 0;
      }

      // Add the number of tables to the cumulative total for the time slot
      reservationsByDateAndTime[date][time] += reservation.no_of_tables;
    });

    // Transform the reservations object into a more suitable array structure
    let reservationsArray = [];
    for (const date in reservationsByDateAndTime) {
      for (const time in reservationsByDateAndTime[date]) {
        reservationsArray.push({
          date: date,
          time: time,
          no_of_tables: reservationsByDateAndTime[date][time]
        });
      }
    }

    // Sort the array by date and time
    reservationsArray.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    // Directly return the sorted array of reservations
    return res.status(200).json(reservationsArray);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving reservations', details: error });
  }
};

// Function to wrap processRequest with CORS handling
const wrappedProcessRequest = (req, res) => {
  cors()(req, res, () => {
    processRequest(req, res);
  });
};

// Register the cloud function
functions.http("getReservationsByRestaurantId", wrappedProcessRequest);
