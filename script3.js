document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.fade-in').forEach((el) => {
        el.classList.add('visible');
    });
});

const attendeeList = document.getElementById("attendeeList");
const attendeeInput = document.getElementById("attendeeInput");
const venueSearch = document.getElementById("venueSearch");
const venueList = document.getElementById("venueList");
const eventDate = document.getElementById("eventDate");
const eventTitle = document.getElementById("eventTitle");
const eventDetails = document.getElementById("eventDetails");
const selectedDate = document.getElementById("selectedDate");
const selectedVenue = document.getElementById("selectedVenue");
const finalAttendees = document.getElementById("finalAttendees");
const finalTitle = document.getElementById("finalTitle");

let attendees = [];
let selectedVenueData = null;

// Add Attendee Function
function addAttendee() {
    const name = attendeeInput.value.trim();
    if (name) {
        attendees.push(name);
        const li = document.createElement("li");
        li.textContent = name;
        
        // Add remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.onclick = () => removeAttendee(name, li);
        li.appendChild(removeBtn);
        
        attendeeList.appendChild(li);
        attendeeInput.value = "";
    }
}

// Remove Attendee Function
function removeAttendee(name, element) {
    attendees = attendees.filter(attendee => attendee !== name);
    element.remove();
}

// Allow "Enter" key to add attendee
attendeeInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addAttendee();
    }
});

// Fetch Venues from Foursquare API
async function fetchVenues() {
    const location = venueSearch.value.trim();
    if (!location) return;

    try {
        const response = await fetch(`https://api.foursquare.com/v3/places/search?near=${location}&limit=5`, {
            headers: {
                "Accept": "application/json",
                "Authorization": 'fsq3imj3OkQ027IEG33EGVCWcIZ64nlgFYRh5RSLaMcn3sg='
            }
        });
        const data = await response.json();
        venueList.innerHTML = "";

        if (data.results && data.results.length > 0) {
            data.results.forEach(place => {
                const li = document.createElement("li");
                li.textContent = place.name;
                li.addEventListener("click", () => selectVenue(place.name));
                venueList.appendChild(li);
            });
        } else {
            venueList.innerHTML = "<li>No venues found</li>";
        }
    } catch (error) {
        console.error("Error fetching venues:", error);
    }
}

// Fetch Weather from OpenWeather API
async function fetchWeather() {
    const location = venueSearch.value.trim();
    if (!location) return;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=5a35e91e0e25a5f3aa632828d12d290a`);
        const data = await response.json();
        if (data.weather) {
            alert(`Weather at ${location}: ${data.weather[0].description}`);
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

// Select Venue
function selectVenue(venue) {
    selectedVenueData = venue;
    selectedVenue.textContent = venue;
    fetchWeather();
}


// Generate Event Summary PDF
function downloadEventSummary() {
    const summary = `Event Date: ${eventDate.value}\nAttendees: ${attendees.join(", ")}\nVenue: ${selectedVenueData}`;
    const blob = new Blob([summary], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Event_Summary.txt";
    a.click();
}

// Finalize Event
function finalizeEvent() {
    if (!eventDate.value || !eventTitle.value || attendees.length === 0 || !selectedVenueData) {
        alert("Please enter a title, select a date, add attendees, and choose a venue before finalizing.");
        return;
    }
    finalTitle.textContent = eventTitle.value;
    selectedDate.textContent = eventDate.value;
    finalAttendees.innerHTML = attendees.map((name) => `<li>${name}</li>`).join("");
    selectedVenue.textContent = selectedVenueData;
    eventDetails.classList.remove("hidden");
    eventDetails.classList.add("show"); // Apply animation class
}
