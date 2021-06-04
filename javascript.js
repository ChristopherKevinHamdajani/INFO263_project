eventNameArray = getAllEventNames();
let completedEvents = [];
let upcomingEvents = [];
let allEvents = [];
let eventsRightNow = [];

/** Everything JSGrid related http://js-grid.com/docs/ **/

let tableFields = [
    {name: "event_id", title: "Id", width:50, type: "number"},
    {name:"event_name", title: "Name", type: "text", width: 200},
    {name: "cluster_name", title: "Client Configuration", type:"text", align: "center"},
    {name: "machine_group", title: "Clients", type: "text", align: "center"},
    {name:"date", title:"Date", type:"text", width:70},
    {name:"time", title: "Start Time", type: "text", align: "right"},
    {name:"finish_time", title:"Finish Time", type:"text", align: "right"},
    {name:"status", title:"Status", type:"text"},
    {title:"Control", type: "control", editButton: false}
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
    //let date = new Date()
    //let month = date.getMonth() + 1;
    //let dateObj = date.getFullYear() + "-0" + month + "-" + date.getDate()
    //let command = {'command': 'getEventsOnDateToDate', 'startDate': dateObj, 'endDate': "2100-03-20"};
//
    //$.post('server.php', command, function(data){
    //    let obj = JSON.parse(data)
    //    createTable(obj, tableFields)
    //})

    createTable(upcomingEvents, tableFields)

})

$(document).on('click', '#completedEvents', null,function() {
   //let date = new Date()
   //let month = date.getMonth() + 1;
   //let dateObj = date.getFullYear() + "-0" + month + "-" + date.getDate()
   //let command = {'command': 'getEventsOnDateToDate', 'startDate': "1999-01-01", 'endDate': dateObj};

   //$.post('server.php', command, function (data) {
   //    let obj = JSON.parse(data)
   //    createTable(obj, tableFields)
   //})
    createTable(completedEvents, tableFields)
})

$(document).on('click', '#currentlyHappening',null, function(){

        createTable(eventsRightNow, tableFields)
})


/****************** Functions ******************/

/**
 * Gets only the event that are activating, doesnt count labs as events.
 */
function getOnlyEventActivation(data){
    let dataToPrint = [];
    for(let x = 0; x < data.length; x++){
        if (data[x]['cluster_name'] !== "Labs" && data[x]['activate'] === "1"){
            let event = data[x];
            for(let i = 0; i < data.length; i++) {

                if (data[i]['cluster_name'] === event['cluster_name'] && data[i]['date'] === event['date'] && data[i]['activate'] === "0" && data[i]['machine_group'] === event['machine_group']){
                    event["finish_time"] = data[i]["time"];
                    data.splice(i,1)
                    i = data.length;
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
    obj = getOnlyEventActivation(data)
    for(let i = 0; i < obj.length; i++){
        obj[i] = getStatus(obj[i]);
    }

    $("#mainTable").jsGrid({
        width: "90%",
        height: "700px",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: obj,
        fields: fields,
        noDataContent: "No Events on this day/period",

        onItemDeleting: function(object){
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
        rowClick: function(args){
            linkToEditPage(args)
        }


    })
    function linkToEditPage(args){
        window.location.replace("edit.php?date="+args.item["date"]+"&eventId=" + args.item["event_id"] + "&eventName=" + args.item["event_name"])
    }

}

/**
 * Displays all the events, outputs to the createTable function
 */
function displayAllEvents(){
    let command = {'command' : "getEvents"}
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
       //obj = getOnlyEventActivation(obj)
       //for(let i = 0; i < obj.length; i++){
       //    obj[i] = getStatus(obj[i]);
       //}
        //allEvents = obj;
        createTable(obj, tableFields)
    })
}

function getStatus(obj){
    let dateOfEvent = new Date(obj['date']+'T'+obj['time']) //Creates a date object of object
    let currentDate = new Date();
    let eventDateEndTime = new Date(obj['date']+'T'+obj['finish_time'])

    if (currentDate.getFullYear() > dateOfEvent.getFullYear()) {
        obj['status'] = "Completed";
    } else if(currentDate.getFullYear() < dateOfEvent.getFullYear()){
        obj['status'] = "Upcoming"
    } else if(currentDate.getMonth() > dateOfEvent.getMonth()){ // If it gets to this point they must have the same year
        obj['status'] = "Completed";
    } else if (currentDate.getMonth() < dateOfEvent.getMonth()){
        obj['status'] = "Upcoming";
    }else if (currentDate.getDate() > dateOfEvent.getDate()){
        obj['status'] = "Completed";
    } else if (currentDate.getDate() < dateOfEvent.getDate()){
        obj['status'] = "Upcoming";
    } else if (currentDate.getDate() === dateOfEvent.getDate()) { // Event must be today

        if (currentDate.getHours() >= dateOfEvent.getHours() && currentDate.getHours() <= eventDateEndTime.getHours()) { // Then we must be within event hours.

            if (currentDate.getHours() === dateOfEvent.getHours()) {
                if (currentDate.getMinutes() >= dateOfEvent.getMinutes()) {
                    obj['status'] = "Current";
                }
            } else if (currentDate.getHours() === eventDateEndTime.getHours()) {
                if (currentDate.getMinutes() > eventDateEndTime.getMinutes()) {
                    obj['status'] = "Completed";
                } else {
                    obj['status'] = "Current"
                }



            } else {
                obj['status'] = "Current"
            }
        } else {
            obj['status'] = "Upcoming"
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
        let currentDate = new Date();
        //allEvents = makeArrayUniqueByEventId(obj)
        //let eventIdSet = new Set();

        obj = getOnlyEventActivation(obj)

        for (let i = 0; i < obj.length; i++) { // Loops over every object and gets status
                allEvents.push(obj[i])
                obj[i] = getStatus(obj[i])
                if (obj[i]['status'] === 'Completed'){
                    completedEvents.push(obj[i])
                } else if(obj[i]['status'] === 'Upcoming'){
                    upcomingEvents.push(obj[i])
                } else if (obj[i]['status'] === 'Current'){
                    eventsRightNow.push(obj[i])
                }


        }
        $("#currentlyHappeningNumber").html(makeArrayUniqueByEventId(eventsRightNow).length)
        $("#completedEventsNumber").html(makeArrayUniqueByEventId(completedEvents).length);
        $('#upcomingEventsNumber').html(makeArrayUniqueByEventId(upcomingEvents).length);
        $('#allEventNumber').html(makeArrayUniqueByEventId(allEvents).length);







        //for (let i = 0; i < obj.length; i++) { // Loops over every object.
        //
        //    //eventIdSet.add(obj[i].event_id) // adds event_id to eventIdSet, compiles list/set of used event_id's
        //    let dateOfEvent = new Date(obj[i]['date']+'T'+obj[i]['time'])
        //    //let objYear = obj[i].date.slice(0, 4);
        //    //let objMonth = obj[i].date.slice(5, 7);
        //    //let objDate = obj[i].date.slice(8);
        //    //if (parseInt(objDate[0]) === 0) { // If date = 06, this makes it 6, needed for the Date Object
        //    //    objDate = objDate[1]
////
        //    //}
        //    //if (parseInt(objMonth[0]) === 0) { // Same as above, but for month.
        //    //    objMonth = objMonth[1]
////
        //    //}
        //    //objMonth = String(Number(objMonth) -1);
        //    //if (Number(objMonth) < 10){
        //    //    objMonth = "0".concat(objMonth)
        //    //}
//
        //    //console.log(dateOfEvent)
        //    if (currentDate.getFullYear() > dateOfEvent.getFullYear()) {
        //        obj[i]['status'] = "Completed";
        //        completedEvents.push(obj[i])
        //    } else if(currentDate.getMonth() > dateOfEvent.getMonth()){
        //        obj[i]['status'] = "Completed";
        //        completedEvents.push(obj[i])
        //    } else if (currentDate.getDay() > dateOfEvent.getDay()){
        //        //console.log(currentDate.getHours())
        //        //console.log(obj[i]['time'])
        //        //console.log(objYear+"-"+objMonth+"-"+objDate+"T"+obj[i]['time'])
        //        //console.log(obj[i]['date']+'T'+obj[i]['time'])
        //        //console.log(new Date(objYear+"-"+objMonth+"-"+objDate+"T"+obj[i]['time']))
        //        //console.log(currentDate.getTime() < dateOfEvent.getTime())
        //        obj[i]['status'] = "Completed";
        //        completedEvents.push(obj[i])
//
        //    } else if (currentDate.getDay() <= dateOfEvent.getDay()){
        //        obj[i]['status'] = "Upcoming";
        //        upcomingEvents.push(obj[i])
        //    } else {
//
        //        //let eventDateStartTime = dateOfEvent;
        //        //console.log(obj[i])
        //        //let eventDateEndTime = new Date(obj[i]['date']+'T'+obj[i]['finish_time'])
        //        //console.log(eventDateEndTime)
        //        //console.log(eventDateStartTime)
        //        //if (currentDate.getHours() >= eventDateStartTime.getHours() && currentDate.getHours() <= eventDateEndTime.getHours()){ // Then we must be within event hours.
        //        //    eventsRightNow.push(obj[i])
////
////
        //        //} else {
        //        //    upcomingEvents.push(obj[i])
        //        //}
        //    }
//
//
//
//
        //}
        //console.log(upcomingEvents)
        //let events = getOnlyEventActivation(upcomingEvents);
        //let todayEvents = [];
        //for (let x = 0; x < events.length; x++){
        //    // only use events that are happening today
        //    let eventDate = new Date(events[x]['date']+'T'+events[x]['time']);
        //    if (currentDate.getFullYear() === eventDate.getFullYear() && currentDate.getMonth() == eventDate.getMonth() && currentDate.getDate() == eventDate.getDate()){
        //        todayEvents.push(events[x])
        //    }
        //}
//
        //console.log(todayEvents)
        //for (let i = 0; i < todayEvents.length; i++){
        //    //console.log(data[i])
//
        //    let eventDateStartTime = new Date(todayEvents[i]['date']+'T'+todayEvents[i]['time']);
        //    let eventDateEndTime = new Date(todayEvents[i]['date']+'T'+todayEvents[i]['finish_time'])
//
        //    if (currentDate.getHours() >= eventDateStartTime.getHours() && currentDate.getHours() <= eventDateEndTime.getHours()  ){ // Then we must be within event hours.
        //            if (currentDate.getHours() === eventDateStartTime.getHours()){
        //                if (currentDate.getMinutes() >= eventDateStartTime.getMinutes()){
        //                    todayEvents[i]['status'] = "Current";
        //                    eventsRightNow.push(todayEvents[i])
        //                }
        //            } else{
        //                todayEvents[i]['status'] = "Current";
        //                eventsRightNow.push(todayEvents[i])
//
        //            }
//
        //    }
//
        //}
        //console.log(eventsRightNow)
        //$("#currentlyHappeningNumber").html(makeArrayUniqueByEventId(eventsRightNow).length)
        //$("#completedEventsNumber").html(makeArrayUniqueByEventId(completedEvents).length);
        //$('#upcomingEventsNumber').html(makeArrayUniqueByEventId(upcomingEvents).length);
        //$('#allEventNumber').html(makeArrayUniqueByEventId(allEvents).length);
    })
}





/**
 * Checks if an object is in a list.
 * @param obj
 * @param list
 * @returns {boolean}
 */
function containsObject(obj, list) {
    let i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
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



