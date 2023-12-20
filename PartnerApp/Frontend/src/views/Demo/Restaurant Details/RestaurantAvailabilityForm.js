import React, { useState, useEffect } from "react";
import "./RestaurantAvailabilityForm.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const RestaurantAvailabilityForm = () => {
  const restaurantId = localStorage.getItem("restaurantId");
  const [restaurantDetails, setRestaurantDetails] = useState({
    restaurant_id: restaurantId,
    restaurant_operation_details: [
      { day: "Sunday", opening_time: "", closing_time: "" },
      { day: "Monday", opening_time: "", closing_time: "" },
      { day: "Tuesday", opening_time: "", closing_time: "" },
      { day: "Wednesday", opening_time: "", closing_time: "" },
      { day: "Thursday", opening_time: "", closing_time: "" },
      { day: "Friday", opening_time: "", closing_time: "" },
      { day: "Saturday", opening_time: "", closing_time: "" },
    ],
  });

  useEffect(() => {
    console.log(
      "Here it is ::" + localStorage.userData.getItem("restaurantId")
    );
    // Fetch previously submitted values from the database
    const fetchPreviousAvailabilities = async () => {
      try {
        const response = await axios.get(
          "https://ks1pq2xfal.execute-api.us-east-1.amazonaws.com/dev/getRestaurantOperations"
        );

        if (response.status === 200) {
          // Update state with fetched values
          setRestaurantDetails({
            ...restaurantDetails,
            restaurant_operation_details:
              response.data || restaurantDetails.restaurant_operation_details,
          });
        } else {
          console.error("Failed to fetch availabilities");
        }
      } catch (error) {
        console.error("Error fetching availabilities:", error);
      }
    };

    fetchPreviousAvailabilities();
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  const handleTimeChange = (day, timeType, value) => {
    const updatedDetails = restaurantDetails.restaurant_operation_details.map(
      (availability) => {
        if (availability.day === day) {
          return {
            ...availability,
            [timeType]: value,
          };
        }
        return availability;
      }
    );

    setRestaurantDetails({
      ...restaurantDetails,
      restaurant_operation_details: updatedDetails,
    });
  };

  const postAvailabilities = async () => {
    try {
      console.log("the object going is ::");
      console.log(restaurantDetails);
      const response = await axios.post(
        "https://oblbtb4rq7.execute-api.us-east-1.amazonaws.com/dev/addRestaurantOperations",
        restaurantDetails
      );

      if (response.status === 200) {
        alert("Availabilities posted successfully");
      } else {
        console.error("Failed to post availabilities");
      }
    } catch (error) {
      console.error("Error posting availabilities:", error);
    }
  };

  return (
    <div className="availability-container">
      <div name="container">
        <h2>Add/Edit Availability</h2>
        {/* Display the added/editable availability */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell> Day of Week </TableCell>
                <TableCell align="right">Opening Time</TableCell>
                <TableCell align="right">Closing Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantDetails.restaurant_operation_details.map(
                (availability, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {availability.day}
                    </TableCell>
                    <TableCell align="right">
                      <input
                        type="time"
                        value={availability.opening_time}
                        onChange={(e) =>
                          handleTimeChange(
                            availability.day,
                            "opening_time",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <input
                        type="time"
                        value={availability.closing_time}
                        onChange={(e) =>
                          handleTimeChange(
                            availability.day,
                            "closing_time",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <button id="post-availability" onClick={postAvailabilities}>
          Post Availabilities
        </button>
      </div>
    </div>
  );
};

export default RestaurantAvailabilityForm;
