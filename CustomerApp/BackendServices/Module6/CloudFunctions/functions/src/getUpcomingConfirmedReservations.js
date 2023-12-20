const axios = require("axios");

exports.handler = async function (req, res, reservationDB) {
  console.log("Reached the getUpcoming Notification function");
  const db = reservationDB.firestore();
  const now = new Date();
  const in30Minutes = new Date(now.getTime() + 30 * 60000); // Calculate time 30 minutes from now
  try {
    // Query Firestore for upcoming confirmed reservations
    console.log("Reached 1");
    const querySnapshot = await db
      .collection("Reservation")
      .where("reservation_status", "==", "confirm")
      .where("reservation_time", ">=", now)
      .where("reservation_time", "<", in30Minutes)
      .get();
    console.log("Reached 2");
    if (querySnapshot.length == 0) {
      return res.status(200).send("No users found");
    }
    querySnapshot.forEach((doc) => {
      // Process each reservation
      const data = doc.data();
      console.log("Connection with Reservation::");
      console.log(doc);
      // Construct an email message
      const emailData = {
        subject: "Reservation Confirmed",
        body:
          data.description +
          ` for a table of ${data.no_of_people}. \n Reservation id: ${
            data.reservation_id
          } \n Time : ${new Date(data.reservation_time._seconds * 1000)}`,
        user_id: data.user_id,
        user_email: "",
      };

      // Send an email notification
      axios
        .post(
          "https://us-central1-serverless-402501.cloudfunctions.net/sendEmailNotifications",
          emailData
        )
        .then((response) => {
          console.log(`Response received is :: ${response}`);
          return res.status(200).send("Emails sent successfully");
        })
        .catch((error) => {
          console.error("Error sending emails:", error);
          return res.status(500).send("Error sending emails");
        });
    });
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    return res.status(500).send("Error retrieving reservations");
  }
};
