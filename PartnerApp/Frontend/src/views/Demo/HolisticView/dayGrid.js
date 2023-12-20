import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './daily.css'; // Path to your CSS file
import timeGridPlugin from '@fullcalendar/timegrid'; // For daily view
import interactionPlugin from '@fullcalendar/interaction'; // Import the plugin

function MyCalendarComponent({ restaurantId }) {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const formatTimeForDisplay = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? 'PM' : 'AM';
    const readableHours = ((hoursInt + 11) % 12 + 1); // Converts 24h time to 12h time
    return `${readableHours}${minutes !== '00' ? ':' + minutes : ''} ${suffix}`;
  };
  


  

  useEffect(() => {

    const resIDStr=localStorage.getItem('restaurant_id');
        console.log(resIDStr)
        const resID = parseInt(resIDStr); 
        const typeOfResID = typeof resID;
console.log(typeOfResID);
        console.log(resID)
    const fetchEvents = async (start, end) => {
      const requestData = {
        restaurant_id: resID
        };
        

      try {
        const response = await fetch('https://aqs85q6n1m.execute-api.us-east-1.amazonaws.com/prod/getdailyview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("data"+data)
        data.forEach(item => {
            console.log(item);
          });
          
        
    // Assuming data is an array of objects with date and time
    const fetchedEvents = data.map(slot => {
        // Combine the date and time into a full ISO string
        const dateTime = `${slot.date}T${slot.time}`;
        const formattedTime = formatTimeForDisplay(slot.time); // Format the time for display
        return {
          title: `Time: ${formattedTime}, ${slot.no_of_tables} Tables`,
          start: dateTime, // Use the combined date and time
        };
      });
  
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
    // Assuming you want to fetch events for the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    fetchEvents(startOfMonth, endOfMonth);

  }, [restaurantId]); // Rerun useEffect when restaurantId changes




  
  const handleViewDidMount = (viewInfo) => {
    setCurrentView(viewInfo.view.type); // Update the current view state
  };

  return (
   <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  }}
  events={events}
  eventTimeFormat={{ // like '14:30:00'
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }}
  allDaySlot={false}
/>
  );
}

export default MyCalendarComponent;
