exports.handler = async function (req, res, reservationDB) {
  const db = reservationDB.firestore();

  console.log(req.body);
  var userData = req.body;

  const completedReservations = [];
  console.log(userData.user_id);

  const querySnapshot = await db
    .collection("Reservation")
    .where("user_id", "==", userData.user_id)
    .where("reservation_status", "==", "Completed")
    .get();

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      completedReservations.push(data);
    });

    console.log(completedReservations);

    res.status(200).send(completedReservations);
  } else {
    res.status(200).send("No reservations found.");
  }
};
