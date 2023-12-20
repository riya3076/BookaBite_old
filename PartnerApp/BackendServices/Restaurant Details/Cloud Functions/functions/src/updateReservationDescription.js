const admin = require("firebase-admin");
const functions = require("firebase-functions");
const cors = require("cors");
const functionsCloud = require("@google-cloud/functions-framework");
const firestore = admin.firestore();

const updateReservationDescription = functions.https.onRequest(
  async (req, res) => {
    // Check if it's a preflight request (OPTIONS method) and respond accordingly
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      // Parse the request body
      const requestBody = req.body;
      // Validate the presence of required fields
      const { restaurantId, date, reservation_status, description } =
        requestBody;
      if (!restaurantId || !date || !reservation_status || !description) {
        return res.status(400).json({
          error:
            "Invalid input. restaurantId, date, status, and description are required.",
        });
      }

      // Convert the frontend date string to a Firestore-compatible date string
      const formattedDate = new Date(date); // Assuming date is a string in "YYYY-MM-DD" format
      const startOfDay = new Date(formattedDate);
      const endOfDay = new Date(formattedDate);

      startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of the day
      endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

      // Update reservation status and description in Firestore
      const reservationRef = firestore
        .collection("reservation")
        .where("restaurant_id", "==", restaurantId)
        .where("reservation_timestamp", ">=", startOfDay.toISOString())
        .where("reservation_timestamp", "<=", endOfDay.toISOString());

      const snapshot = await reservationRef.get();

      console.log(
        "The value of snapshot whether it is empty or not:" + snapshot.empty
      );
      console.log(snapshot);

      if (snapshot.empty) {
        return res.status(404).json({
          error: "No reservations found for the given restaurant ID and date.",
        });
      }

      const batch = firestore.batch();

      snapshot.forEach((doc) => {
        const reservationDocRef = firestore
          .collection("reservation")
          .doc(doc.id);
        batch.update(reservationDocRef, { reservation_status, description });
      });

      await batch.commit();

      return res.status(200).json({
        message: "Reservation status and description updated successfully.",
      });
    } catch (error) {
      console.error(
        "Error updating reservation status and description:",
        error
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Function to wrap processRequest with CORS handling
const wrappedProcessRequest = (req, res) => {
  cors()(req, res, () => {
    updateReservationDescription(req, res);
  });
};

exports.handler = wrappedProcessRequest;
// Register the cloud function
functionsCloud.http("updateReservationDescription", wrappedProcessRequest);
