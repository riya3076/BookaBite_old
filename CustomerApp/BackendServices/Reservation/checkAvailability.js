
const admin = require("firebase-admin");
const functions = require("@google-cloud/functions-framework");
const cors = require("cors");
const https = require('https');

// Initialize the Firebase Admin SDK with your credentials file
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const processRequest = (req, res) => {
  if (req.method !== 'POST') {
        return res.status(400).send({ error: 'Invalid request method' });
    }

    const db = admin.firestore();
    const { restaurant_id, checkDate } = req.body;

    // Invoke the Lambda function to get operationHours and no_of_tables
    const lambdaRequest = https.request({
        hostname: 'w43mncduifetmkpzglnizw5fpi0ybtow.lambda-url.us-east-1.on.aws',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }, (lambdaResponse) => {
        let data = '';
        lambdaResponse.on('data', (chunk) => {
            data += chunk;
            
            try {



// Detect the pattern and insert a comma to separate the JSON objects
let fixedData = data.replace(/},]/g, "}]");


// Add brackets to make it a valid JSON array
fixedData = '[' + fixedData + ']';


    const JSONparsedData = JSON.parse(fixedData);
    console.log(JSONparsedData);





 
    function trimObjectKeys(obj) {
        if (!obj || typeof obj !== 'object') return obj;
    
        if (Array.isArray(obj)) {
            return obj.map(trimObjectKeys);
        } else {
            return Object.keys(obj).reduce((acc, key) => {
                acc[key.trim()] = trimObjectKeys(obj[key]);
                return acc;
            }, {});
        }
    }
    
    const trimmedData = trimObjectKeys(JSONparsedData);
    const parsedData=trimmedData[0];
    const no_of_tables = parsedData.restaurant_number_of_tables;
    
 const restaurant_operation_details = parsedData.restaurant_operation_details;
 
 // Assuming you are looking for today's operation hours
 const today = new Date(checkDate).getDay();
 const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 
 // Find operation details for the specific day
 const operationDetailsForToday = restaurant_operation_details.find(detail => {
     return detail.day === days[today];
 });
 

 const openingHour = parseInt(operationDetailsForToday.opening_time / 100);
const closingHour = parseInt(operationDetailsForToday.closing_time / 100);
                 // Fetching reservations related to the restaurant_id for the specific date
     db.collection('Reservation')
     .where("restaurant_id", "==", parseInt(restaurant_id))
     .get()
        .then(reservationsSnapshot => {
            const unFilteredreservations = reservationsSnapshot.docs.map(doc => doc.data());
            const reservations = unFilteredreservations.filter(unFilteredreservations => {
                const reservationDate = unFilteredreservations.reservation_timestamp.split('T')[0];
                return reservationDate === checkDate;
            });
            console.log("Filtered Reservations:", reservations);
      
        
        
        
        
        
 
         let availability = {};
         let dateStr = new Date(checkDate).toISOString().split('T')[0]; // YYYY-MM-DD format
         availability[dateStr] = [];
 
         for (let hour = openingHour; hour <= closingHour; hour++) {
             const isBookedForThisHour = reservations.some(res => {
                const reservationHour = parseInt(res.reservation_timestamp.split('T')[1].split(':')[0], 10);
                return reservationHour === hour && res.reservation_timestamp.split('T')[0] === dateStr;
             });
 
             if (!isBookedForThisHour) {
                 availability[dateStr].push({
                     timeSlot: `${hour}:00`,
                     availableTables: no_of_tables
                 });
             } else {
                 const bookedTablesForThisHour = reservations.filter(res => {
                    const reservationHour = parseInt(res.reservation_timestamp.split('T')[1].split(':')[0], 10);
                    return reservationHour === hour && res.reservation_timestamp.split('T')[0] === dateStr;
                    }).reduce((acc, curr) => acc + curr.no_of_tables, 0);
 
                 if (no_of_tables - bookedTablesForThisHour > 0) {
                     availability[dateStr].push({
                         timeSlot: `${hour}:00`,
                         availableTables: no_of_tables - bookedTablesForThisHour
                     });
                 }
             }
         }
 
         return res.status(200).json(availability);
     })
     .catch(error => {
         return res.status(500).send({ error: 'Failed fetching reservations', details: error });
     });
 
             } catch (error) {
                 return res.status(500).send({ error: 'Failed parsing Lambda function response: '+data+"type: "+typeof data, details: error });
             }
        });

        lambdaResponse.on('end', () => {
            console.log("Full data:", data);
        });
    });

    lambdaRequest.on('error', (error) => {
        return res.status(500).send({ error: 'Failed fetching data from Lambda function', details: error });
    });

    // Send restaurant_id to the Lambda function
    lambdaRequest.write(JSON.stringify({ restaurantId: restaurant_id }));
    lambdaRequest.end();
};
// Function to wrap processRequest with CORS handling
const wrappedProcessRequest = (req, res) => {
  cors()(req, res, () => {
    processRequest(req, res);
  });
};
functions.http("checkSlotsByDate", wrappedProcessRequest);