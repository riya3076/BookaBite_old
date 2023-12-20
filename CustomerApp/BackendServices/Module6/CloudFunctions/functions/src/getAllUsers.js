const axios = require("axios");

exports.handler = async function (req, res, usersDB) {
  const db = usersDB.firestore();

  const emailDetails = req.body;
  // console.log(emailDetails);

  // Query Firestore to get all users
  try {
    const userQuerySnapshot = await db.collection("users").get();
    if (!userQuerySnapshot.empty) {
      userQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Connected to the users database successfully.");
        console.log(data);
        const emailData = {
          subject: emailDetails.subject,
          body: emailDetails.body,
          user_id: data.user_id,
          user_email: data.email_id,
        };
        // console.log();
        // Send email notifications to all users
        axios
          .post(
            "https://us-central1-serverless-402501.cloudfunctions.net/sendEmailNotifications",
            emailData
          )
          .then((response) => {
            console.log("Users found successfully.");
            return res
              .status(200)
              .send("Email sent to all the users successfully!!");
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
            return res.status(500).send("Error fetching users");
          });
      });
    } else {
      console.error("No Users present yet");
      return res.status(200).send("No users found!!");
    }
  } catch (error) {
    console.log("Faced an error");
    console.log(error);
  }
};
