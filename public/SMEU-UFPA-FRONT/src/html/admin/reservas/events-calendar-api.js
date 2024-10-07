$(document).ready(function() {
  // Function to fetch events from the API
  async function fetchEventsFromAPI() {
    try {
      const response = await fetch('http://localhost:8000/reservation/list-all-reservations'); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const eventsFromAPI = await response.json();
      return eventsFromAPI;
    } catch (error) {
      console.error('Error fetching events:', error);
      return []; // Return an empty array if there's an error
    }
  }

  // Initialize FullCalendar
  async function initializeCalendar() {
    const eventsFromAPI = await fetchEventsFromAPI(); // Fetch events

    var calendar = $("#calendar").fullCalendar({
      header: {
        left: "title",
        center: "agendaDay,agendaWeek,month",
        right: "prev,next today"
      },
      editable: true,
      firstDay: 1,
      selectable: true,
      defaultView: "month",
      axisFormat: "h:mm",
      allDaySlot: false,
      selectHelper: true,
      events: eventsFromAPI.flatMap(function(event) {
        return event.shift.map(function(shift) {
          // Determine className based on status
          var eventClass = "";
          if (event.status === "false") {
            eventClass = "important"; // Class for red events
          } else if (event.status === "true") {
            eventClass = "success"; // Class for green events
          }

          return {
            title: `Reserva: ${event.details}, Turno: ${shift.nameShift}`,
            start: new Date(event.startDate).toISOString(), // Corrigido para obter ISO
            end: new Date(event.endDate).toISOString(), // Corrigido para obter ISO
            allDay: true, // Torna o evento um evento de dia inteiro
            className: eventClass
          };
        });
      })
    });
  }

  // Call the function to initialize the calendar
  initializeCalendar();
});















/*
$(document).ready(function() {
  var eventsFromAPI = [
    {
      uuid: "36405822-ccda-4821-94c7-fdbe904f5f8e",
      startDate: "2024-10-10T14:30:00.000Z",
      endDate: "2024-10-11T14:30:00.000Z",
      details: "123",
      status: "false", // Use status here
      shift: [
        {
          uuid: "04fd1c01-64aa-4715-afcf-54e6ff0197fe",
          nameShift: "Manhã"
        },
        {
          uuid: "12345678-90ab-cdef-1234-567891abcdef",
          nameShift: "Tarde"
        }
      ]
    },
    {
      uuid: "36405822-ccda-4821-94c7-fdbe904f5f8e",
      startDate: "2024-10-15T14:30:00.000Z",
      endDate: "2024-10-20T14:30:00.000Z",
      details: "123",
      status: "true", // Use status here
      shift: [
        {
          uuid: "04fd1c01-64aa-4715-afcf-54e6ff0197fe",
          nameShift: "Manhã"
        },
        {
          uuid: "12345678-90ab-cdef-1234-567891abcdef",
          nameShift: "Tarde"
        }
      ]
    }
  ];

  var calendar = $("#calendar").fullCalendar({
    header: {
      left: "title",
      center: "agendaDay,agendaWeek,month",
      right: "prev,next today"
    },
    editable: true,
    firstDay: 1,
    selectable: true,
    defaultView: "month",
    axisFormat: "h:mm",
    allDaySlot: false,
    selectHelper: true,
    events: eventsFromAPI.flatMap(function(event) {
      return event.shift.map(function(shift) {
        // Determine className based on status
        var eventClass = "";
        if (event.status === "false") {
          eventClass = "important"; // Class for red events (you can style this class with red color)
        } else if (event.status === "true") {
          eventClass = "success"; // Class for green events (you can style this class with green color)
        }

        return {
          title: `Details: ${event.details}, Shift: ${shift.nameShift}`,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: true, // Make the event an all-day event to remove time display
          className: eventClass
        };
      });
    })
  });
});

*/
