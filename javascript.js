eventNameArray = getAllEventNames();



function createTable(data, fields){
    $("#mainTable").jsGrid({
        width: "90%",
        height: "700px",
        inserting: false,
        editing: false,
        sorting: true,
        paging: false,
        data: data,
        fields: fields
    })
}

function getEvents(){
    let command = {'command' :'getEvents'};
    let returnArray = [];

    let tableFields = [
        {name:"event_id", title:"Id", type : "number", width: 20},
        {name:"event_name", title: "Name", type: "text", width: 200},
        {name:"date", title:"Date", type:"text", width:70},
        {name:"cluster_name", title:"Cluster", type:"text", width:70},
        {name:"time", title: "Time", type: "text"},
        {name:"activate", title: "Activate", type: "number"}
    ];

    $.post('server.php', command, function(data){

    let obj = JSON.parse(data)
    createTable(obj, tableFields)
    $("#frontpageTable").slideDown("slow")
    })

}

function populateEventClusterServerCall(){
        let command = {'command': "getEventClusterList"}
        $.post('server.php', command, function (data){
            let obj = JSON.parse(data);
            for (let i = 0; i < obj.length; i++){
                let newSelectItem = "<option value=" + obj[i]["cluster_id"] + ">" +obj[i]["cluster_name"] + "</option>"
                $("#selectEventClusterDropdown").append(newSelectItem)
            }

        })
    }


function populateGroupSelectorDropdown(){
        let command = {'command': "getGroups"}
        $.post('server.php', command, function (data){
            let obj = JSON.parse(data);
            for (let i = 0; i < obj.length; i++){
                let newSelectItem = "<option value=" + obj[i]["group_id"] + ">" +obj[i]["machine_group"] + "</option>"
                $("#selectGroup").append(newSelectItem)
            }

        })
    }

$("#restOfForm").submit(function(event){
        event.preventDefault()
        let date = $("#dateInput").val()
        let startTime = $("#startTimeInput").val()
        let eventLength = $("#eventLengthInput").val()
        let startTimeOffset = $("#startTimeInputOffset").val()
        let event_id = $("#hiddenEventId").val();
        let machineGroups = $("#selectGroup").val();
        let clusterId = $("#selectEventClusterDropdown").val();


        let command = {'command': "submitEvent","cluster_id": clusterId, "event_id": event_id, "eventLength" : eventLength, "date" : date, "time" : startTime, "offset": startTimeOffset, "machineGroups": machineGroups}
        $.post("server.php", command, function(){

        })
        alert("Event created succesfully.")
        window.location.replace("mainscreen.html");

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


// This function runs when the submit button is pressed
// Checks to see if the value being submitted doesn't already exist in eventNameArray
$("#eventNameForm").submit(function(event){
    event.preventDefault();
    let inputValue = $("#eventNameInput").val();
    let getIndexOfEvent = eventNameArray.indexOf(inputValue)
    if (getIndexOfEvent > -1){
        // If value does exist in array, this runs.
        alert("This already exists")
    } else{
        // Else this does
        let command = {'command' : 'insertEvent', 'data': inputValue};
        $("#eventNameHeader").text(inputValue);
        $.post('server.php', command, function(data){
            let obj = JSON.parse(data)
            let eventId = obj[0]['event_id'];


        })

    }

})




$(document).ready(function(){
    populateGroupSelectorDropdown();
    populateEventClusterServerCall();
})





