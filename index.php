<?php
    //session_start();
    //if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    //    header("location: login.php");
    //    exit;
    //}
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

    <title>Event Scheduler</title>

</head>
<body>

<?php
include ('navbar.php'); // Includes the navbar, so each page has the same navbar.
?>



    <div id="container" class="container">

        <div id="eventNumberContainer" class="row mt-3 mb-3">
            <div class="col " >
                <div class="container row" id="currentEventsBox">
                    <div class="col homepageButtonNumber innerShadow currentEvents robotoButton" id="allEventNumber">-</div>
                    <button class="col homepageButtons shadow currentEvents robotoButton" id="allEventsButton">All Events</button>
                </div>
            </div>
            <div class="col ">
                <div class="container row" id="upcomingEventsBox">
                    <div class="col innerShadow robotoButton homepageButtonNumber upcomingEvents" id="upcomingEventsNumber">-</div>
                    <button class="col robotoButton shadow homepageButtons upcomingEvents" id="upcomingEventsButton">Upcoming Events</button>
                </div>
            </div>
            <div class="col " id="pastEventsBox">
                <div class="container row">
                    <div class="col innerShadow robotoButton homepageButtonNumber completedEvents" id="completedEventsNumber">-</div>
                    <button class="col shadow robotoButton homepageButtons completedEvents"  id="completedEvents">Completed Events</button>
                </div>
            </div>
        </div>
        <div class="row">
            <label for="startDate" class="col-2">Start Date</label>
            <input class="col-3" type="date" id="startDate">
            <label for="endDate" class="col-2">End Date</label>
            <input class="col-3" type="date" id="endDate">
            <button id="searchDateButton" class="col-2">Go</button>
        </div>
        <div class="row">
            <div class="col" id="mainTable">
            </div>
        </div>
        <div class="row">
            <div class="col" id="otherTable">

            </div>
        </div>



    </div>

</div>



</body>

</html>