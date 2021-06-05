<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php
    include ('header.php'); // Includes the header, so each page has the same header.
    ?>
    <title>Edit Event</title>

</head>
<body>
<?php
include ('navbar.php'); // Includes the navbar, so each page has the same navbar.
?>


    <div id="container" class="container">
        <div id="eventTitle" class=" text-center mt-2">
            <h1 class="col-4 mx-auto" id="editPageEventName"></h1>
        </div>

        <div class="d-flex pt-2 pb-2 flex-wrap col-10 mx-auto " id="eventActions">

        </div>
        <script>
            let queryString = window.location.search;
            let urlParams = new URLSearchParams(queryString);
            let date = urlParams.get('date');
            let eventId = urlParams.get('eventId');
            let eventName = urlParams.get("eventName")

            $("#editPageEventName").text(eventName);

            function populateClusterOptions(select, clusterId){
                let command = {'command': "getEventClusterList"}
                $.post('server.php', command, function (data){
                    let obj = JSON.parse(data);
                    for (let i = 0; i < obj.length; i++){
                        if (obj[i]["cluster_id"] === clusterId){
                            $("#" + select).append("<option value=" + obj[i]["cluster_id"] + " selected>" +obj[i]["cluster_name"] + "</option>")
                        } else {
                            $("#" + select).append("<option value=" + obj[i]["cluster_id"] + ">" +obj[i]["cluster_name"] + "</option>")
                        }
                    }

                })
            }

            function returnOnOrOff(number){
                if (number === "0"){
                    return "Off"
                } else {
                    return "On"
                }
            }

            function createEventActionsEdit(i,actionId, eventId, timeOffset, clusterId, activate){
                return "<div class='container mt-2 mb-2 col-5 ' id='editItemAction'>" +
                    "<form id='formActionId" + actionId + "' class='formActionChange' novalidate>" +
                    "<div class='row actionIdP' ><p class='col-4 mx-auto '>Action Id: " + actionId + "</p></div>" +
                    "<div class='row mb-1 align-items-center'>" +
                    "   <div class='col-auto'>" +
                    "       <label for='timeOffset"+ i +"' class='col-form-label '>Time Offset</label>" +
                    "   </div>" +
                    "   <div>" +
                    "       <input name='timeOffset' class='col-auto form-control ' id='timeOffset" + i + "'>" +
                    "   </div>" +
                    "</div>" +
                    "<div class='row mb-1'>" +
                        "<div>" +
                            "<label for='selector"+ actionId +"' class='col-6'>Cluster</label>" +
                        "</div>" +
                        "<div>" +
                            "<select name='clusterSelect' class='col-5 form-control' id=selector" + actionId + "></select>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row mb-1'><p class='col-6'>Cluster State</p><p class='editPara  col-3'>" + returnOnOrOff(activate) + "</p></div>" +
                    "<div class='row'><button type='submit' for='formActionId" + actionId + "' id=" + actionId + " class='btn mb-2 col-6 mx-auto btn-primary actionIdChangeButton'>Change</button><input type='hidden' value='" + actionId + "' name='actionId'></div>" +
                    "</form></div>";
            }

            let command = {'command' :'getEventActions', 'event_id' : eventId};
            $.post('server.php', command, function(data){
                let obj = JSON.parse(data)
                let i = 0;
                obj.forEach(function(object){
                    let actionId = object["action_id"];
                    let eventId = object["event_id"];
                    let timeOffset = object["time_offset"];
                    let clusterId = object["cluster_id"];
                    let activate = object["activate"];
                    $("#eventActions").append(createEventActionsEdit(i, actionId, eventId, timeOffset, clusterId, activate));
                    $("#timeOffset" + i).val(timeOffset)
                    populateClusterOptions("selector" + actionId, clusterId)

                    i += 1;
                })

            })

            $(document).on("submit", ".formActionChange", null, function(event){
                let array = $(this).serializeArray()
                //console.log(array)
                let timeOffset = array[0].value
                let clusterId = array[1].value
                let actionId = array[2].value

                event.preventDefault()
                let command = {'command' :'updateEventAction', 'action_id' : actionId, 'cluster_id': clusterId, 'time_offset': timeOffset};
                $.post('server.php', command, function(data) {
                    window.location.replace("edit.php" + queryString);
                    alert("Event updated succesfully.")
                })

            })


        </script>

    </div>


</body>

</html>




























