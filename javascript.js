eventNameArray = getAllEventNames();
let completedEvents = [];
let upcomingEvents = [];
let allEvents = [];

/** Everything JSGrid related http://js-grid.com/docs/ **/

let tableFields = [
    {name: "event_id", title: "Id", type: "number"},
    {name:"event_name", title: "Name", type: "text", width: 200},
    {name: "cluster_name", title: "Client Configuration", type:"text"},
    {name: "machine_group", title: "Clients", type: "text"},
    {name:"date", title:"Date", type:"text", width:70},
    {name:"time", title: "Time", type: "text"},
    {name:"activate", title: "Activate", type: "number"},
    {title:"Control", type: "control"}
];



/****************** Document Listeners ******************/




$(document).on('keypress', '#searchBar',null, function(){
    searchBarInput();
});

$(document).on('click', 'body', null, function() {
    if(!$('#searchResults').hidden){
        $('#searchResults').slideUp()
    }
})

$(document).on('mouseover', '.searchListItem', null, function(){
    $(this).css('background-color', "yellow")
})
$(document).on('mouseout', '.searchListItem', null, function(){
    $(this).css('background-color', "white")
})

$(document).on('click', '.searchListItem', null, function(){
    let event_name = this['id'];
    let command = {'command' : 'getEventsThatMatchName', 'eventName': event_name};
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })

})



$(document).on('click', '#allEventsButton',null, function(){
    displayAllEvents()
})

$(document).on('click', '#searchDateButton', function (){
    let startDate = $("#startDate").val()
    let endDate = $("#endDate").val()
    searchDate(startDate, endDate)
})


$(document).on('click', '#upcomingEventsButton',null, function(){
    let date = new Date()
    let month = date.getMonth() + 1;
    let dateObj = date.getFullYear() + "-0" + month + "-" + date.getDate()
    let command = {'command': 'getEventsOnDateToDate', 'startDate': dateObj, 'endDate': "2100-03-20"};

    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })
})

$(document).on('click', '#completedEvents', null,function() {
    let date = new Date()
    let month = date.getMonth() + 1;
    let dateObj = date.getFullYear() + "-0" + month + "-" + date.getDate()
    let command = {'command': 'getEventsOnDateToDate', 'startDate': "1999-01-01", 'endDate': dateObj};

    $.post('server.php', command, function (data) {
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })
})


/****************** Functions ******************/



/**
 * Creates the table displayed on the mainpage using JSGrid.
 * @param data The date for the table.
 * @param fields The fields for the table.
 */
function createTable(data, fields){
    $("#mainTable").jsGrid({
        width: "90%",
        height: "700px",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: data,
        fields: fields,
        noDataContent: "No Events on this day/period",
        onItemDeleting: function(object){
            let eventId = object.item["event_id"]
            let command = {"command":"delete","event_id":eventId}
            $.post('server.php', command, function(data){
                let obj = JSON.parse(data);
                if (obj === "Success"){
                    window.location.replace("mainscreen.html");
                    alert("Event deleted successfully.")
                }
            })


        },
        rowClick: function(args){
            window.location.replace("edit.html?date="+args.item["date"]+"&eventId=" + args.item["event_id"])
        }
    })
}

/**
 * Displays all the events, outputs to the createTable function
 */
function displayAllEvents(){
    let command = {'command' : "getEvents"}
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })
}


/**
 * Updates the event numbers on the main page.
 */
function populateEventNumbers(){
    let data = {'command' : "getEvents"}
    $.post('server.php', data ,function (data) {
        let obj = JSON.parse(data)
        let dateObject = new Date();
        allEvents = makeArrayUniqueByEventId(obj)
        let eventIdSet = new Set();
        for (let i = 0; i < obj.length; i++) {
            eventIdSet.add(obj[i].event_id) // adds event_id to eventIdSet, compiles list/set of used event_id's

            let objYear = obj[i].date.slice(0, 4);
            let objMonth = obj[i].date.slice(5, 7);
            let objDate = obj[i].date.slice(8);

            if (objDate[0] === 0) { // If date = 06, this makes it 6, needed for the Date Object
                objDate = objDate[1]
            }
            if (objMonth[0] === 0) { // Same as above, but for month.
                objMonth = objMonth[1]

            }
            let dateObj = new Date(objYear, objMonth, objDate)
            if (dateObj < dateObject) {

                completedEvents.push(obj[i])
            } else if (dateObj > dateObject) {

                upcomingEvents.push(obj[i])
            }

            $("#completedEventsNumber").html(makeArrayUniqueByEventId(completedEvents).length);
            $('#upcomingEventsNumber').html(makeArrayUniqueByEventId(upcomingEvents).length);
            $('#allEventNumber').html(makeArrayUniqueByEventId(allEvents).length);
        }

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
    console.log("Submitted")
    let date = $("#dateInput").val()
    let startTime = $("#startTimeInput").val()
    let eventLength = $("#eventLengthInput").val()
    let startTimeOffset = $("#startTimeInputOffset").val()
    let event_id = $("#hiddenEventId").val();

    let machineGroups = $("#selectGroup").val();
    let clusterId = $("#selectEventClusterDropdown").val();


    let command = {'command': "submitEvent","cluster_id": clusterId, "event_id": event_id, "eventLength" : eventLength, "date" : date, "time" : startTime, "offset": startTimeOffset, "machineGroups": machineGroups}
    $.post("server.php", command, function(){
        window.location.replace("mainscreen.html");
        alert("Event created succesfully.")
    })



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
        console.log(eventName)
        $("#eventName").text(eventName)
        console.log(data)
        let eventId = "";
        obj.forEach(function(event){
            eventId = event["event_id"]
        })
        console.log(eventId)
        $("#hiddenEventId").val(eventId)
        console.log($("#hiddenEventId").val())

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



//function viewEvent(){
//
//    $.post('server.php', command, function(data){
//        let obj = JSON.parse(data)
//        obj.forEach(function(event){
//            let command = {'command' :'getEventFromId', 'eventId' : event['event_id']};
//            $.post('server.php', command, function(data){
//                let obj = JSON.parse(data)
//                let dateArray = []
//                obj.forEach(function(event){
//
//                })
//                console.log(obj)
//            })
//
//        })
//    })
//}



