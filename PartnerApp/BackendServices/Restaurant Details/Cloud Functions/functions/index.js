const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

const updateReservationDescriptionFunction = require("./src/updateReservationDescription");
exports.updateReservationDescription = onRequest(async (req, res) => {
  updateReservationDescriptionFunction.handler(req, res);
});

const checkTablesAvailabilityFunction = require("./src/checkTablesAvailability");
exports.checkTablesAvailability = onRequest(async (req, res) => {
  checkTablesAvailabilityFunction.handler(req, res);
});
