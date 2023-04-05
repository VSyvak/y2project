
// Import eventData dependency allowing access to its exported functions
import * as eventData from './dataAccess/eventData.js';
import * as busesData from './dataAccess/busesData.js';
import { Supabase } from './dataAccess/supabase.js';

/*
  Functions used to update the index page view
*/

// reference to page element where rows will be inserted 
const eventRows = document.getElementById('eventRows');

// Display event objects in a table element
//
function displayEventList(events) {

  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="eventRows"> element.
  
  const tableRows = events.map(event => {

    // Note: the following is a template string, enclosed by `backticks` and not 'single quotes'
    // This allows ${JavaScript} to be added directl to the string if enclosed by ${ }
    // See https://wesbos.com/template-strings-html for more.


    // A row is returned for each event found in events.
    // rows are added to tableRows
    return `<tr>
          <td>${event.id}</td>
          <td>${event.time_arrival}</td>
          <td>${event.location}</td>
          <td>${event.direction}</td>
          <td data-toggle="tooltip" title="bus_id=${event.bus_id}">${event.buses.location}</td>
      </tr>`;
  });

  // Add rows to the table body
  eventRows.innerHTML = tableRows.join("");
}


// Get JSON array of events
// Then pass that data for display
//
async function loadAndDisplayData() {
  // load all events and display
  // use the event repository to get the data
  const events = await eventData.getAllEvents();
  console.log('events:', events);
  displayEventList(events);
}

// export functions
export {
  loadAndDisplayData,
}


// Get and display data when the page loads
loadAndDisplayData();


// Get JSON array of events 
// Then pass that data for display
//
async function loadAndDisplayData() {

  // Load all buses and display
  const buses = await busesData.getAllBuses();
  console.log("Buses:" , buses);
}

// Show events for selected bus
// 
async function filterBuses() {

  // Get id of cat link (from the data attribute)
  // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
  const bus_id = Number(this.dataset.bus_id);

  // validation - if 0 or NaN reload everything 
  if (isNaN(bus_id) || bus_id == 0) {
    loadAndDisplayData();

    // otherwise get events for this bus
  } else {

    // Get events 
    const events = await eventData.getEventByBusId(bus_id);

    // If events returned then display them 
    if (Array.isArray(events)) {
      displayEventList(events);
    }
  }
}

// Get events for a bus, by its id
//
async function getEventByBusId(id) {

  // to do: validate id

  // define variable to store events
  let events;

  // execute db query
  try {
    // Execute the query
    const result = await Supabase
    .from("events") // select from events
    .select("*, buses(name)") // * from events and name from buses
    .eq("bus_id", id) // where bus_id == id
    .order("timestamp", {ascending: false});  // order by timestamp

  // first element of the recordset contains products
  events = await result.data;
  // console.log('events: ', result.data);

    // catch and log errors to server side console
  } catch (error) {
    console.log("Supabase Error - get all events: ", error.message);
}   finally {
}
// return all products found
return events;
}


// Function to show events based on search box text
// 
async function filtersearch() {

  // read the value of the search input field
  const search = document.getElementById("inputSearch").value;

  // Get events by calling eventData.search
  const events = await eventData.searchFilter(search);

  // If events returned then display them
  if (Array.isArray(events)) {
    displayEventList(events);
  }

}

// Sort based on user value
// Sort direction opposite to current direction
// 
async function toggleSortUser() {

  // read current sort order from session storage if true
  let sUser = JSON.parse(sessionStorage.getItem('sortUser')) === true;

  // set session storage value to opposite (not sUser or !sUser)
  sessionStorage.setItem('sortUser', !sUser);

  // load events - pass filter options as a parameters
  const events = await eventData.getAllEvents("user", !sUser);
  console.log("events:", events);
  displayEventList(events);
}


// Return event styling depending on level
// icons - https://icons.getbootstrap.com/
// 
function getAlertStyle(level) {
  const error = {
    alert: 'alert alert-danger',
    icon: 'bi bi-bug-fill'
  };

  const warning = {
    alert: 'alert alert-warning',
    icon: 'bi bi-exclamation-triangle-fill'
  };

  const _default = {
    alert: 'alert alert-light',
    icon: 'bi bi-calendar3-event-fill'
  };

  // return style object based on level value
  switch(level) {
    case 'error':
      return error;
    case 'warning':
      return warning;
    case 'information':
      return information;
    // Everything else
    default:
      return _default;
  }
}

export { loadAndDisplayData, filterBuses, toggleSortUser };

// Add event listeners to page elements
// document.getElementById('inputSearch').addEventListener('keypress', filtersearch);
document.getElementById("btnSearch").addEventListener("click", filterBuses);

document.getElementById("userSort").addEventListener("click", toggleSortUser)

// Initial data load
loadAndDisplayData();