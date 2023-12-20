// Function to send email notifications
const nodemailer = require("nodemailer");

exports.handler = async function (req, res, usersDB) {
  const db = usersDB.firestore();
  console.log(req.body);
  const emailData = req.body;

  // Create a transporter with your email provider's credentials
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "",
      pass: "",
    },
  });

  if (emailData.user_email === "") {
    // Get the user email from Firestore
    const userQuerySnapshot = await db
      .collection("users")
      .where("user_id", "==", emailData.user_id)
      .get();

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email_id;

      // Compose and send the email
      const mailOptions = {
        from: "",
        to: email,
        subject: emailData.subject,
        text: emailData.body,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.error("User not found.");
    }
  } else {
    const email = emailData.user_email;

    // Compose and send the email
    const mailOptions = {
      from: "",
      to: email,
      subject: emailData.subject,
      text: emailData.body,
    };

    await transporter.sendMail(mailOptions);
  }

  return res.status(200).json({ message: "Email sent to all" });
};
