exports.handler = async function (change, context, usersDB) {
  const db = usersDB.firestore();

  const newValue = change.after.data();
  const previousValue = change.before.data();

  // Compare the new and previous "food_reservation" arrays to identify the changes
  const newFoodReservation = newValue.food_reservation;
  const previousFoodReservation = previousValue.food_reservation;
  // Find the differences between the two arrays
  const changes = diffArrays(newFoodReservation, previousFoodReservation);
  const user_id = newValue.user_id;

  const description = newValue.description;
  // Check if the "reservation_status" field has changed
  if (newValue.reservation_status !== previousValue.reservation_status) {
    const status = newValue.reservation_status;
    console.log("Reached here!!!=>1");
    // Retrieve the user's email from the Users collection
    const userQuerySnapshot = await db
      .collection("users")
      .where("user_id", "==", user_id)
      .get();

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();
      const userEmail = userData.email_id;

      // Create an email body
      const emailBody = `Hello,

      Your reservation with ID ${context.params.reservation_id} has been updated.
      New Status: ${status}
      Description: ${description}

      Thank you for using our service!

      Regards,
      Your Restaurant Team`;

      const emailData = {
        subject: `Reservation ${status}`,
        body: emailBody,
        user_email: userEmail,
        user_id: user_id,
      };

      getUserEmailCaller(emailData);
    } else {
      console.log("Could not find the user");
    }
  } else if (changes.added.length > 0 || changes.removed.length > 0) {
    // Handle changes to the "food_reservation" array
    const reservationId = context.params.reservation_id;

    // const user_id = newValue.user_id;
    // const description = newValue.description;
    const status = newValue.reservation_status;
    // There are changes in the "food_reservation" array

    // Retrieve the user's email from the Users collection
    const userSnapshot = await db
      .collection("users")
      .where("user_id", "==", user_id)
      .get();

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const userEmail = userData.email_id;
      // You can handle these changes here similarly to how you handle status changes
      console.log(
        `Changes detected in food_reservation for reservation ${reservationId}:`
      );
      console.log(changes);

      // Create an email or perform any other actions based on the changes
      let emailBody = `Hello,

        Your reservation with ID ${context.params.reservation_id} has been updated.
        New Status: ${status}
        Description: ${description}
        
        Menu Item Changes:
        `;

      // Append details about added items
      if (changes.added.length > 0) {
        emailBody += "\nAdded Items:\n";
        changes.added.forEach((item) => {
          emailBody += `- Item ID: ${item.item_id}, Quantity: ${item.quantity}\n`;
        });
      }

      // Append details about removed items
      if (changes.removed.length > 0) {
        emailBody += "\nRemoved Items:\n";
        changes.removed.forEach((item) => {
          emailBody += `- Item ID: ${item.item_id}, Quantity: ${item.quantity}\n`;
        });
      }

      emailBody += `
        Thank you for using our service!

        Regards,
        Your Restaurant Team`;

      const emailData = {
        subject: `Reservation ${status}`,
        body: emailBody,
        user_email: userEmail,
        user_id: user_id,
      };

      getUserEmailCaller(emailData);
    } else {
      console.log(`No user found with the ID ${user_id}`);
    }
  }

  return null;
};

function diffArrays(newArray, oldArray) {
  const added = newArray.filter(
    (item) => !oldArray.some((oldItem) => oldItem.item_id === item.item_id)
  );
  const removed = oldArray.filter(
    (item) => !newArray.some((newItem) => newItem.item_id === item.item_id)
  );

  return { added, removed };
}
