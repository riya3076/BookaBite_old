const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const reservationServiceAccount = require("./keys/reservationcredentials.json");
const usersServiceAccount = require("./keys/userscredentials.json");
const admin = require("firebase-admin");

const reservationDB = admin.initializeApp(
  {
    credential: admin.credential.cert(reservationServiceAccount),
  },
  "reservation"
);

const usersDB = admin.initializeApp(
  {
    credential: admin.credential.cert(usersServiceAccount),
  },
  "users"
);

// Function to get upcoming confirmed reservations
const getUpcomingConfirmedReservationsFunction = require("./src/getUpcomingConfirmedReservations");
exports.getUpcomingConfirmedReservations = onRequest(async (req, res) => {
  getUpcomingConfirmedReservationsFunction.handler(req, res, reservationDB);
});

const sendEmailNotificationsFunction = require("./src/sendEmailNotifications");
exports.sendEmailNotifications = onRequest(async (req, res) => {
  sendEmailNotificationsFunction.handler(req, res, usersDB);
});

// Function to get all users
const getAllUsersFunction = require("./src/getAllUsers");
exports.getAllUsers = onRequest(async (req, res) => {
  getAllUsersFunction.handler(req, res, usersDB);
});

const handleReservationStatusChangeFunction = require("./src/handleReservationStatusChange");
// Function to handle reservation status change using Firestore trigger
exports.handleReservationStatusChange = functions.firestore
  .document("Reservation/{reservation_id}")
  .onUpdate(async (change, context) => {
    handleReservationStatusChangeFunction.handler(change, context, usersDB);
  });

// Function to get all completed reservations for a customer
const getAllCompletedReservationsForCustomerFunction = require("./src/getAllCompletedReservationsForCustomer");
exports.getAllCompletedReservationsForCustomer = onRequest(async (req, res) => {
  getAllCompletedReservationsForCustomerFunction.handler(
    req,
    res,
    reservationDB
  );
});
