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
    <?php
    include ('header.php'); // Includes the header, so each page has the same header.
    ?>
    <link rel="stylesheet" href="style.css">
    <title>New Event</title>

</head>
<body>
<?php
include ('navbar.php'); // Includes the navbar, so each page has the same navbar.
?>



<div id="container" class="container">
        <div id="newEventForm">
            <div id="createEventName">
                <form id="eventNameForm">
                <div class="shadowAndBorder  p-3">
                    <div class="form-floating ">
                        <input id="eventNameInput" class="form-control" type="text" placeholder="Event Name" name="eventName" required="required" >
                        <label for="eventNameInput" class="form-label">Enter Event Name</label>
                    </div>
                    <div>
                        <button type="submit" class="m-2 btn btn-primary"for="eventNameForm">Submit</button>
                    </div>
                </div>
                </form>
            </div>
            <div id="restOfForm" style="display: none" novalidate>
                <form id="eventForm" class="col-8 mx-auto" >
                    <h1 id="eventName"></h1>

                    <div class="mt-3">
                        <label for="selectEventClusterDropdown" class="form-label">Select Event Cluster</label>
                        <select name="eventCluster" class="form-select " id="selectEventClusterDropdown" required="required">
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
                        <input type="date" id="dateInput" class="form-control" required="required">
                    </div>

                    <div class="mt-3">
                        <label for="startTimeInput" class="form-label">Start Time</label>
                        <input type="time" class="form-control" id="startTimeInput" name="startTime" required="required">
                    </div>



                    <div class="mt-3">
                        <label for="startTimeInputOffset" class="form-label">Start Time Offset</label>
                        <input type="text" id="startTimeInputOffset" class="form-control" name="startTimeOffset" placeholder="-00:00:00">
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                        <div class="invalid-feedback">
                            Please enter a valid time in the format of "-hh:mm:ss"
                        </div>
                    </div>


                    <div class="mt-3">
                        <label for="eventLengthInput" class="form-label">Event Length</label>
                        <input type="text" id="eventLengthInput"  class="form-control" name="eventLengthInput" placeholder="00:00:00" required="required">
                        <div class="invalid-feedback">
                            Please enter a valid time in the format of "hh:mm:ss".
                        </div>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
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



























