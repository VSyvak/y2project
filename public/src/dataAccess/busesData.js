/*
    Functions used to work with Bus related data
*/

// Get a db connection by importing supabase.js which sets it up
import { Supabase } from './supabase.js';

// Function to get all events from supabase
// 
async function getAllBuses() {

        // 1. define variable to store events
        let buses;

        // 1. execute query to get buses
        try {
            // 2. store result
            const result = await Supabase
            .from("buses") // select data from the buses table
            .select("*") // all columns
            .order("name", { ascending: true }); // sort by name

            // 3. Read data from the result
            buses = await result.data;

            // Catch and log errors to server side console
        } catch (error) {
            console.log("Supabase Error - get all events: ", error.message);
        }   finally {
        }
        // 4. return all buses found
        return buses;
}

// 1. Parse JSON
// 2. Create buses links
// 3. Display in webpage
//
function displayBuses(buses) {

    // Use the Array map method to iterate through the array of categories (in json format)
    const busLinks = buses.map((bus) => {


        // return a link button for each bus, setting attribute data-bus_id for the id
        // the data attribute is used instead of id as an id value can only be used once in the document 
        // note the bus-link css class - used to identify the buttons (used later)
        return `<button data-bus_id="${bus.id}" class="list-group-item-action bus-button">
                        ${bus.name}
                    </button>`;
    });

    // Add a link for 'all buses' to start of the list
    // first check busLinks is an array
    if (Array.isArray(busLinks)) {
        // Then use unshift to move all elements up one and insert a new element at the start
        // This button has bus_id=0
        busLinks.unshift(`<button data-computer_id="0"
                                      class="list-group-item list-group-item-action bus-button">
                                      All Buses
                                    </button>`);
    }

    // Set the innerHTML of the productRows root element = rows
    // join(' ') converts the rows array to a string, replacing the ',' delimiter with ' ' (blank)
    document.getElementById("busList").innerHTML = busLinks.join("");

    // Add Event listeners to handle clicks 
    // When clicked, the bus links will filter events - displaying events for the buses
    //
    // 1. Find button all elements with matching the class name used to identify buses buttons
    const busButtons = document.getElementsByClassName("bus-button");

    // 2. Assign a 'click' event listener to each button
    // When clicked the filterBuses() function will be called.
    for (let i = 0; i < busButtons.length; i++) {
        busButtons[i].addEventListener("click", filterBuses);
    }
}

// Export functions for import elsewhere
export {
    getAllBuses
};