<?php
session_start();
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
    <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.css" />
    <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid-theme.min.css" />

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js"></script>
    <script type="text/javascript" src="javascript.js"></script>

    <title>Title</title>

</head>
<body>
<?php
include ('navbar.php'); // Includes the navbar, so each page has the same navbar.
?>



<div id="container" class="container">
        <div id="newEventForm">
            <div id="createEventName">
                <form id="eventNameForm">
                <div class="border-bottom pb-3 mt-3">
                    <div class="form-floating ">
                        <input id="eventNameInput" class="form-control" type="text" placeholder="Event Name" name="eventName" required="required" >
                        <label for="eventNameInput" class="form-label">Enter Event Name</label>
                    </div>
                    <div>
                        <button type="submit" for="eventNameForm">Submit</button>
                    </div>
                </div>
                </form>
            </div>
            <div id="restOfForm" style="display: none">
                <form id="eventForm" class="col-8 mx-auto">
                    <h1 id="eventName"></h1>

                    <div class="mt-3">
                        <label for="selectEventClusterDropdown" class="form-label">Select Event Cluster</label>
                        <select name="eventCluster" class="form-select" id="selectEventClusterDropdown" required="required">
                        </select>
                    </div>



                    <div class="mt-3">
                        <label for="selectGroup" class="form-label">Select Computer Groups</label>
                        <select name="group" id="selectGroup" class="form-select" multiple="multiple" required="required">
                        </select>
                        <div class="form-text">You can select multiple groups by holding down ctrl key on windows or the command key on Mac</div>
                    </div>



                    <div class="mt-3">
                        <label for="dateInput" class="form-label">Date</label>
                        <input type="date" id="dateInput" required="required">
                    </div>

                    <div class="mt-3">
                        <label for="startTimeInput" class="form-label">Start Time</label>
                        <input type="time" id="startTimeInput" name="startTime" required="required">
                    </div>



                    <div class="mt-3">
                        <label for="startTimeInputOffset" class="form-label">Start Time Offset</label>
                        <input type="text" id="startTimeInputOffset" name="startTimeOffset" placeholder="-00:00:00">
                    </div>

                    <div class="mt-3">
                        <label for="eventLengthInput" class="form-label">Event Length</label>
                        <input type="text" id="eventLengthInput" name="eventLengthInput" placeholder="00:00:00">
                    </div>

                    <div class="mt-3 mx-auto">
                        <button type="submit" class="btn btn-primary" id="submitEvent" form="eventForm">Submit</button>
                        <input type="hidden" name="event_id" value="" id="hiddenEventId">
                    </div>


                </form>


            </div>



        </div>


    </div>
</div>



</body>

</html>



























