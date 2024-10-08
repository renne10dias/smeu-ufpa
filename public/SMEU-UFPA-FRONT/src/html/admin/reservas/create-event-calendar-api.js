$(document).ready(function() {
    // Event listener for submit button click
    $('#submitButtonId').on('click', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Capture the values of checked checkboxes
        const selectedShifts = [];
        if ($('#manha').is(':checked')) {
            selectedShifts.push($('#manha').val()); // Add the value (shift ID) to the array
        }
        if ($('#tarde').is(':checked')) {
            selectedShifts.push($('#tarde').val()); // Add the value (shift ID) to the array
        }
        if ($('#noite').is(':checked')) {
            selectedShifts.push($('#noite').val()); // Add the value (shift ID) to the array
        }

        // Capture form data
        const eventName = $('#calendar_event_name').val();
        const startDate = new Date($('#kt_calendar_datepicker_start_date').val()).toISOString(); // Convert to ISO
        const endDate = new Date($('#kt_calendar_datepicker_end_date').val()).toISOString(); // Convert to ISO

        // Get the space and user IDs (replace with your own values)
        const spaceUUID = getQueryParam('uuid-reserva'); // Function to get the UUID from the URL
        const userId = '3991fa15-a13b-4e25-801a-15c2409491c3'; // Example user ID

        // Create the reservation data object
        const reservationData = {
            startDate: startDate,
            endDate: endDate,
            status: "false", // Define the status logic here
            details: eventName,
            spaceId: spaceUUID,
            userId: userId,
            shiftIds: selectedShifts // Add the selected shifts (IDs)
        };

        // Log reservation data for debugging
        console.log('JSON da Reserva:', JSON.stringify(reservationData, null, 2));

        // Retrieve the token from session storage
        const token = sessionStorage.getItem('token'); // Use the key you stored the token with

        fetch('http://localhost:8000/reservation', { // Adjust for your creation endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // Add the token to the Authorization header
            },
            body: JSON.stringify(reservationData),
        })
        .then(response => {
            return response.json().then(data => {
                if (response.status === 403) {
                    // Redirect to another page if access is forbidden
                    window.location.href = '../../login/index.html'; // Change this to your desired URL
                    return; // Exit the function
                }

                if (!response.ok) {
                    // Check HTTP status codes for more specific feedback
                    switch (response.status) {
                        case 404:
                            alert(data.message); // Show specific error alert
                            break;
                        case 500:
                            alert(data.message); // Show server error alert
                            break;
                        default:
                            throw new Error('An unexpected error occurred. Please try again.');
                    }
                } else {
                    alert(data.message); // Show success message
                    location.reload(); // Reload the page after success
                }
                return data; // Return data for further handling if needed
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message); // Show custom error alert
        });

        // Close the modal after submission
        $('#dateRangeModal').modal('hide');
    });

    // Function to fetch events from the API
    async function fetchEventsFromAPI() {
        try {
            const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
            const response = await fetch('http://localhost:8000/reservation/list-all-reservations', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`, // Add the token to the headers
                    'Content-Type': 'application/json'
                }
            });
    
            // Check for 403 Forbidden status
            if (response.status === 403) {
                window.location.href = '../../login/index.html'; // Redirect to the login page or any desired URL
                return; // Exit the function to prevent further processing
            }
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const eventsFromAPI = await response.json(); // Assuming the response is in JSON format
            return eventsFromAPI;
        } catch (error) {
            console.error('Error fetching events:', error);
            return []; // Return an empty array if there's an error
        }
    }
    
    // Function to get the query parameter by name
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Initialize the FullCalendar
    async function initializeCalendar() {
        const eventsFromAPI = await fetchEventsFromAPI(); // Fetch events

        $("#calendar").fullCalendar({
            header: {
                left: "title",
                center: "agendaDay,agendaWeek,month",
                right: "prev,next today"
            },
            editable: true,
            firstDay: 1,
            selectable: true, // Allow date range selection
            selectHelper: true,
            defaultView: "month",
            axisFormat: "h:mm",
            allDaySlot: false,

            // Define events
            events: eventsFromAPI.flatMap(function(event) {
                return event.shift.map(function(shift) {
                    // Determine className based on status
                    var eventClass = event.status === "false" ? "important" : "success";

                    return {
                        title: `Reserva: ${event.details}, Turno: ${shift.nameShift}`,
                        start: new Date(event.startDate).toISOString(), // Corrected to obtain ISO
                        end: new Date(event.endDate).toISOString(), // Corrected to obtain ISO
                        allDay: true, // Make the event an all-day event
                        className: eventClass
                    };
                });
            }),

            // Handle the selection event to capture the start and end of the selected date range
            select: function(start, end) {
                const formattedStartDate = start.toISOString().split('T')[0]; // Get the start date
                const formattedEndDate = end.toISOString().split('T')[0]; // Get the end date (exclusive)

                // Fill the modal input fields with the selected dates
                $('#kt_calendar_datepicker_start_date').val(formattedStartDate);
                $('#kt_calendar_datepicker_end_date').val(formattedEndDate);

                // Show the modal
                $('#dateRangeModal').modal('show');
            }
        });
    }

    // Call the function to initialize the calendar
    initializeCalendar();
});
