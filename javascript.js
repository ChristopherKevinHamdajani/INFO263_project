eventNameArray = getAllEventNames();
let currentEvents = [];
let completedEvents = [];
let upcomingEvents = [];
let eventArray = [];
let allEvents = [];




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
                if (obj == "Success"){
                    window.location.replace("mainscreen.html");
                    alert("Event deleted succesfully.")
                }
            })


        },
        rowClick: function(args){
            let eventId = args.item["event_id"]
            console.log(args.item)
            window.location.replace("edit.html?date="+args.item["date"]+"&eventId=" + args.item["event_id"])
        }
    })
}

$(document).on('click', '#allEventsButton',null, function(){
    displayAllEvents()
})

function displayAllEvents(){
    let command = {'command' : "getEvents"}
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })
}

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


function populateEventNumbers(eventArray){
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
            let objTime = obj[i].time;

            if (objDate[0] == 0) { // If date = 06, this makes it 6, needed for the Date Object
                objDate = objDate[1]
            }
            if (objMonth[0] == 0) { // Same as above, but for month.
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


function makeArrayUniqueByEventId(array){
    let tempArray = [];
    for (let i = 0; i < array.length; i++) { // Loops through and pushes each unique event_id + obj to array
        if (!tempArray.some(e => e.event_id === array[i].event_id)) {
            tempArray.push(array[i])
        }
    }
    return tempArray
}








function viewEvent(){

    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        obj.forEach(function(event){
            let command = {'command' :'getEventFromId', 'eventId' : event['event_id']};
            $.post('server.php', command, function(data){
                let obj = JSON.parse(data)
                let dateArray = []
                obj.forEach(function(event){

                })
                console.log(obj)
            })

        })
    })
}

function getEvents(){
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1
    let dateString = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDate.getDate();
    let command = {'command' :'getEventsOnDate', 'date': dateString};
    let returnArray = [];
    $.post('server.php', command, function(data){
        let obj = JSON.parse(data)
        createTable(obj, tableFields)
    })

}




$(document).on('click', '#searchDateButton', function (){
    let startDate = $("#startDate").val()
    let endDate = $("#endDate").val()
    searchDate(startDate, endDate)
})


function searchDate(startDate, endDate){
    if($("#startDate").val() !== ""){ // There was a start date value selected
        if($("#endDate").val() !== ""){ // There was also a end date value selected
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

// This function makes a call to the server, server returns an JSON of event names that pre-exist
// This function then saves that JSON to an array of just the names called eventNameArray
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


function searchBarInput(){
    if ($('#searchBar').val() == ""){
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



$(document).ready(function(){
    getEvents();
    //viewEvent();
    populateEventNumbers()
    populateGroupSelectorDropdown("selectGroup");
    populateEventClusterServerCall("selectEventClusterDropdown");

})





