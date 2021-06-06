eventNameArray = getAllEventNames();
let completedEvents = [];
let upcomingEvents = [];
let allEvents = [];
let eventsRightNow = [];
let completedText = "<div class='completedText'>Completed</div>";
let upcomingText = "<div class='upcomingText'>Upcoming</div>";
let currentText = "<div class='currentlyText'>Currently</div>"

/** Everything JSGrid related http://js-grid.com/docs/ **/

/**
 * The fields for the table on the index page.
 * See JSGrid documentation.
 */
let tableFields = [
    {name: "event_id", title: "Id", width:50, type: "number"},
    {name:"event_name", title: "Name", type: "text", width: 200},
    {name: "cluster_name", title: "Client Configuration", type:"text", align: "center"},
    {name: "machine_group", title: "Clients", type: "text", align: "center"},
    {name:"date", title:"Date", type:"text", width:70},
    {name:"time", title: "Start Time", type: "text", align: "right"},
    {name:"finish_time", title:"Finish Time", type:"text", align: "right"},
    {name:"status", title:"Status", type:"text", align: "center"},
    {title:"Control", type: "control", editButton: false}
];







/****************** Document Listeners ******************/


/**
 * Runs when a keypress is registered in the searchbar.
 */
$(document).on('keypress', '#searchBar',null, function(){
    searchBarInput();
});

/**
 * When anywhere on the body is clicked, if the searchbar results are on show this will make them hidden with Jquery slideUp method.
 */
$(document).on('click', 'body', null, function() {
    if(!$('#searchResults').hidden){ // If SearchResults not hidden.
        $('#searchResults').slideUp()
    }
})


/**
 * When a user clicks on any of the search results, this runs.
 * It populates the table with all events that have the same id.
 */
$(document).on('click', '.searchListItem', null, function(){
    let event_name = this['id'];
    let command = {'command' : 'getEventsThatMatchName', 'eventName': event_name};
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })
})


/**
 * When user clicks on "All Events" button on the index page.
 */
$(document).on('click', '#allEventsButton',null, function(){
    displayAllEvents()
})


/**
 * When user clicks on the search button on the index page.
 * Grabs the values from the two date inputs and hands them off to searchDate function.
 */
$(document).on('click', '#searchDateButton', function (){
    let startDate = $("#startDate").val()
    let endDate = $("#endDate").val()
    searchDate(startDate, endDate)
})


/**
 * When user clicks on "Upcoming Events" button.
 * Creates a table from the "upcomingEvents" array.
 */
$(document).on('click', '#upcomingEventsButton',null, function(){
    createTable(upcomingEvents, tableFields)

})

/**
 * When user clicks on "Completed Events" button.
 * Creates a table from the "completedEvents" array.
 */
$(document).on('click', '#completedEvents', null,function() {
    createTable(completedEvents, tableFields)
})

/**
 * When user clicks on "Current Events" button.
 * Creates a table from the "eventsRightNow" array.
 */
$(document).on('click', '#currentlyHappening',null, function(){
        createTable(eventsRightNow, tableFields)
})


















/****************** Functions ******************/

/**
 * Gets only the clusters (Known as Clients) that are activating, as in the events that have a cluster(client) that has a 1 in the activate column.
 * Doesnt count lab clusters in this.
 */
function getOnlyEventActivation(data){
    let dataToPrint = []; // The array to return.
    for(let x = 0; x < data.length; x++){ // Goes through each item in data.
        if (data[x]['cluster_name'] !== "Labs" && data[x]['activate'] === "1"){ // Checks that event's cluster is activating and isn't a "Labs".
            let event = data[x];
            for(let i = 0; i < data.length; i++) {
                if (data[i]['cluster_name'] === event['cluster_name'] && data[i]['date'] === event['date'] && data[i]['activate'] === "0" && data[i]['machine_group'] === event['machine_group']){ //Finds the matching activation pair (Checks if everything is the same as above, but with 0 instead of 1 in activation)
                    event["finish_time"] = data[i]["time"]; // Adds a finish_time to the object.
                    data.splice(i,1) // Because its found a match, removes this object from data array so that it can't be matched again.
                    i = data.length; // Because its found, ends loop.
                }

            }
            dataToPrint.push(data[x])
        }
    }
    return dataToPrint;
}

/**
 * Creates the table displayed on the index page using JSGrid.
 * @param data The date for the table.
 * @param fields The fields for the table.
 */
function createTable(data, fields){
    let obj = getOnlyEventActivation(data)
    for(let i = 0; i < obj.length; i++){
        obj[i] = getStatus(obj[i]);
    }

    $("#mainTable").jsGrid({
        width: "100%",
        height: "700px",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: obj,
        fields: fields,
        noDataContent: "No Events to display.", // The text to display if no event is being displayed.
        pagerContainer:$("#footer"),
        onItemDeleting: function(object){ // When the red rubbish icon is clicked, this runs.
            let eventId = object.item["event_id"]
            let command = {"command":"delete","event_id":eventId}
            $.post('server.php', command, function(data){
                let obj = JSON.parse(data);
                if (obj === "Success"){
                    window.location.replace("index.php");
                    alert("Event deleted successfully.")
                }
            })


        },
        rowClick: function(args){ // When the user clicks on a row this runs.
            linkToEditPage(args)
        }


    })

    /**
     * Moves on to the edit window.
     * @param args
     */
    function linkToEditPage(args){
        window.location.replace("edit.php?date="+args.item["date"]+"&eventId=" + args.item["event_id"] + "&eventName=" + args.item["event_name"])
    }

}

/**
 * Displays all the events, outputs to the createTable function
 */
function displayAllEvents(){ // Runs when user clicks "All Events" button.
    let command = {'command' : "getEvents"}
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })
}

/**
 * Sets the status for event object passed to it.
 * @param obj The event object.
 * @returns {*} Returns the event object with status added.
 */
function getStatus(obj){
    let dateOfEvent = new Date(obj['date']+'T'+obj['time']) //Creates a date/time object from the "Event" object. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    let currentDate = new Date(); // Creates the current date/time object.
    let eventDateEndTime = new Date(obj['date']+'T'+obj['finish_time']) // Creates a date/time object using the events finish time.

    if (currentDate.getTime() > dateOfEvent.getTime()){
        obj['status'] = completedText;
    } else if (currentDate.getTime() < dateOfEvent.getTime()){
        obj['status']  = upcomingText;
    }

     if (currentDate.getDate() === dateOfEvent.getDate() && currentDate.getFullYear() == dateOfEvent.getFullYear() && currentDate.getMonth() == dateOfEvent.getMonth()) { // If Event's date is the same as today's date, this checks that if its currently happening.
        if (currentDate.getHours() >= dateOfEvent.getHours() && currentDate.getHours() <= eventDateEndTime.getHours()) { // Then we must be within event hours, only need to check that it isn't the same as the finish time hour, but past the finish time minutes.
            if (currentDate.getHours() == eventDateEndTime.getHours()) {
                if (currentDate.getMinutes() < eventDateEndTime.getMinutes()) {
                    obj['status'] = currentText;
                } else {
                    obj['status'] = completedText;
                }
            } else if (currentDate.getHours() === dateOfEvent.getHours()){
                if (currentDate.getMinutes() < dateOfEvent.getMinutes()){
                    obj['status'] = upcomingText;
                } else {
                    obj['status'] = currentText;
                }

            }
        }
     }
    return obj;

}



/**
 * Updates the event numbers on the main page.
 */
function populateEventNumbers(){
    let data = {'command' : "getEvents"} // Gets every event.
    $.post('server.php', data ,function (data) {
        let obj = JSON.parse(data)
        obj = getOnlyEventActivation(obj) // Runs the array (Which is every event) through the function to get only the events that are activating a cluster other than lab.
        for (let i = 0; i < obj.length; i++) { // Loops over every object.
            obj[i] = getStatus(obj[i]) // Gets the status of the object (Upcoming, completed
            allEvents.push(obj[i]) // Pushes object to array that keeps track of all the events.
                if (obj[i]['status'] === completedText){
                    completedEvents.push(obj[i])
                } else if(obj[i]['status'] === upcomingText){
                    upcomingEvents.push(obj[i])
                } else if (obj[i]['status'] === currentText){
                    eventsRightNow.push(obj[i])
                }


        }
        $("#currentlyHappeningNumber").html(makeArrayUniqueByEventId(eventsRightNow).length);
        $("#completedEventsNumber").html(makeArrayUniqueByEventId(completedEvents).length);
        $('#upcomingEventsNumber').html(makeArrayUniqueByEventId(upcomingEvents).length);
        $('#allEventNumber').html(makeArrayUniqueByEventId(allEvents).length);

    })
}


/**
 * Makes incoming array into a unique set of event_id
 * @param array The array to be turned into a set
 * @returns A set of unique event_id objects.
 */
function makeArrayUniqueByEventId(array){
    let tempArray = [];
    for (let i = 0; i < array.length; i++) { // Loops through and pushes each unique event_id + obj to array
        if (!tempArray.some(e => e.event_id === array[i].event_id)) {
            tempArray.push(array[i])
        }
    }
    return tempArray
}


/**
 * Gets the events happening today. Passed data to createTable
 */
function getEvents(){
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1
    let dateString = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDate.getDate();
    let command = {'command' :'getEventsOnDate', 'date': dateString};
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })

}


/**
 * Creates a table either between the two dates, or just on one date.
 * @param startDate The date to start from, or the date to show.
 * @param endDate The date to end on.
 */
function searchDate(startDate, endDate){
    if(startDate !== ""){ // There was a start date value selected
        if(endDate !== ""){ // There was also a end date value selected
            let command = {'command' :'getEventsOnDateToDate', 'startDate': $("#startDate").val(), 'endDate': $("#endDate").val()};
            $.post('server.php', command, function(data){
                let obj = JSON.parse(data)
                createTable(obj, tableFields)
            })
        } else { // Just a start date value selected
            let command = {'command' :'getEventsOnDate', 'date': $("#startDate").val()};

            $.post('server.php', command, function(data){
                let obj = JSON.parse(data)
                createTable(obj, tableFields)
            })

        }
    }
}


/**
 * Gets all the event names in the database.
 * @returns An array of event names.
 */
function getAllEventNames(){
    let command = {'command' : 'getEventNames'};
    let returnArray = [];
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data);
        for (let i = 0; i < obj.length; i++) {
            returnArray.push(obj[i]["event_name"]);
        }
    })

    return returnArray;
}












/****************** Create Event Functions ******************/


/**
 * Populates the Event cluster dropdown.
 * @param select The dropdown Id selector to populate.
 */
function populateEventClusterServerCall(select){
        let command = {'command': "getEventClusterList"}
        $.post('server.php', command, function (data){
            let obj = JSON.parse(data);
            for (let i = 0; i < obj.length; i++){
                let newSelectItem = "<option value=" + obj[i]["cluster_id"] + ">" +obj[i]["cluster_name"] + "</option>"
                $("#" + select).append(newSelectItem)
            }

        })
    }


/**
 * Populates the machine group selector dropdown.
  * @param select The dropdown id to populate.
 */
function populateGroupSelectorDropdown(select){
        let command = {'command': "getGroups"}
        $.post('server.php', command, function (data){
            let obj = JSON.parse(data);
            for (let i = 0; i < obj.length; i++){
                let newSelectItem = "<option value=" + obj[i]["group_id"] + ">" +obj[i]["machine_group"] + "</option>"
                $("#" + select).append(newSelectItem)
            }

        })
}


/**
 * The submit functions for the event.
 */
$(document).on("submit", '#eventForm', null, function(event){
    event.preventDefault()
    let date = $("#dateInput").val()
    let startTime = $("#startTimeInput").val()
    let eventLength = $("#eventLengthInput").val()
    let startTimeOffset = $("#startTimeInputOffset").val()
    let event_id = $("#hiddenEventId").val();

    let machineGroups = $("#selectGroup").val();
    let clusterId = $("#selectEventClusterDropdown").val();
    console.log("Button pressed")

    let command = {'command': "submitEvent","cluster_id": clusterId, "event_id": event_id, "eventLength" : eventLength, "date" : date, "time" : startTime, "offset": startTimeOffset, "machineGroups": machineGroups}
    $.post("server.php", command, function(){
        window.location.replace("index.php");
        alert("Event created successfully.")
    })
})


/**
 * Adds the valid class to the object.
 * @param id The id of the object
 */
function classIsValid(id){
    $(id).removeClass('is-invalid')
    $(id).addClass('is-valid')
    $("#submitEvent").attr("disabled",false);
}

/**
 * Adds the invalid class to the object.
 * @param id the id of the object.
 */
function classIsInvalid(id){
    $(id).removeClass('is-valid')
    $(id).addClass('is-invalid')
    $("#submitEvent").attr("disabled",true);
}

$(document).on("input", '#startTimeInputOffset', null, function(element){
    let id = '#startTimeInputOffset'
    let input = $(id).val()
    let regexToMatch = new RegExp('(-[0-2][0-4]:[0-5][0-9]:[0-5][0-9])')
    if(input.length > 9 || regexToMatch.test(input) === false){
        classIsInvalid(id)
    } else {
        classIsValid(id)
    }
})

$(document).on("input", '#eventLengthInput', null, function(element){
    let id = '#eventLengthInput'
    let input = $(id).val()
    let regexToMatch = new RegExp('([0-2][0-4]:[0-5][0-9]:[0-5][0-9])')
    if(input.length > 8 || regexToMatch.test(input) === false){
        classIsInvalid(id)
    } else {
        classIsValid(id)
    }
})





/**
 * The submit functions for the event name selector.
 */
$(document).on("submit", "#eventNameForm", null, function(event){
    event.preventDefault()
    let eventName = $("#eventNameInput").val();
    let command = {'command':'insertEvent', 'data': eventName}
    $.post("server.php", command, function(data){
        let obj = JSON.parse(data)
        $("#eventName").text(eventName)
        let eventId = "";
        obj.forEach(function(event){
            eventId = event["event_id"]
        })
        $("#hiddenEventId").val(eventId)
        $("#createEventName").slideUp();
        $("#restOfForm").slideDown();
    })
})


/**
 * Handles all the search bar functions.
 */
function searchBarInput(){
    if ($('#searchBar').val() === ""){
        $("#searchResults").slideUp();
        $('#searchResults').html(function () {
            return ""
        })
    } else{
        let data = {'command':'searchString','string' : $('#searchBar').val()} // THis is the text in the search bar
        $.post("server.php", data, function(data){
            let obj = JSON.parse(data);
            $('#searchResults').html(function () { //updates the html within the search list
                let listArray = new Set();  //Creates a set
                for (let i = 0; i < obj.length; i++){
                    listArray.add(obj[i].event_name); // adds all the results to the set to remove duplicates
                }
                let list = ""

                //$('#loadingIcon').hide() // Hides the loading Icon
                //$('#searchSuggestionOptions').css({'justify-content' : 'start'}) //Moves the results up to the top

                listArray.forEach((value, key) => {
                    list += "<li class='searchListItem' id=" + key + "><a href='#'>"+ key + "</a></li>"
                })


                return list
            })
            $("#searchResults").slideDown();

        })
    }
}







/**
 * When the document has loaded, fires off these functions.
 */
$(document).ready(function(){

    getEvents();
    populateEventNumbers()
    populateGroupSelectorDropdown("selectGroup");
    populateEventClusterServerCall("selectEventClusterDropdown");


})



