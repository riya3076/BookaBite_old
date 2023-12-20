import React, { useState, useEffect } from "react";
import axios from "axios";

const TableDetails = () => {
  const [numTables, setNumTables] = useState(0);
  const [tableSize, setTableSize] = useState(2);
  const [tableDetails, setTableDetails] = useState([]);
  const restaurantId = localStorage.getItem("restaurant_id");
  useEffect(() => {
    // Fetch table details from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://qt2t180kgi.execute-api.us-east-1.amazonaws.com/dev/gettables"
        );

        if (response.status === 200) {
          setTableDetails(response.data.tableDetails || []);
        } else {
          console.error("Failed to fetch table details");
        }
      } catch (error) {
        console.error("Error fetching table details:", error);
      }
    };

    fetchData();
  }, []);

  const handleTableDetailsSubmit = () => {
    if (![2, 4, 6, 8].includes(tableSize)) {
      alert("Number of tables must be 2, 4, 6, or 8.");
      return;
    }

    if (numTables === 0) {
      alert("No of tables cannot be zero");
      return;
    }

    // Check if an entry with the same table size already exists
    if (tableDetails.some((entry) => entry.tableSize === tableSize)) {
      alert("Table with the same size already exists.");
      return;
    }

    // Update the table details array with a new entry
    setTableDetails((prevTableDetails) => [
      ...prevTableDetails,
      { id: Date.now(), numTables, tableSize },
    ]);

    // Reset form values
    setNumTables(0);
    setTableSize(2);
  };

  const handleDeleteEntry = (id) => {
    // Filter out the entry with the specified id
    setTableDetails((prevTableDetails) =>
      prevTableDetails.filter((entry) => entry.id !== id)
    );
  };

  const handlePostData = async () => {
    // Prepare the data object
    const postData = {
      restaurant_id: restaurantId,
      table_details: tableDetails.reduce((acc, entry) => {
        acc[entry.numTables] = entry.tableSize;
        return acc;
      }, {}),
    };

    console.log(postData);
    // Post the data to a specified URL
    const response = await axios.post(
      "https://oblbtb4rq7.execute-api.us-east-1.amazonaws.com/dev/addtables",
      postData
    );

    if (response.status === 200) {
      alert("Data posted successfully");
    } else {
      alert("Failed to post data successfully");
    }
  };

  return (
    <div>
      <h2>Restaurant Reservation System</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Number of Tables:
          <input
            type="number"
            value={numTables}
            onChange={(e) => setNumTables(e.target.value)}
          />
        </label>
        <br />
        <label>
          Table Size:
          <select
            value={tableSize}
            onChange={(e) => setTableSize(parseInt(e.target.value, 10))}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </label>
        <br />
        <button onClick={handleTableDetailsSubmit}>Add Table</button>
      </form>

      {/* Display added table details */}
      <div>
        <h3>Added Table Details</h3>
        <ul>
          {tableDetails.map((entry) => (
            <li key={entry.id}>
              {`No Of tables: ${entry.numTables} Table size: ${entry.tableSize}`}
              <button onClick={() => handleDeleteEntry(entry.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Button to post data */}
      <button onClick={handlePostData}>Post Data</button>
    </div>
  );
};

export default TableDetails;
