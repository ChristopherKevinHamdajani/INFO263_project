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

    <title>Event Scheduler</title>

</head>
<body>

<?php
include ('navbar.php'); // Includes the navbar, so each page has the same navbar.
?>



    <div id="container" class="container">

        <div id="eventNumberContainer" class="row p-1 mt-2 ">
            <div class="col " >
                <div class="container row" id="currentEventsBox">
                    <div class="col homepageButtonNumber innerShadow currentEvents robotoButton" id="allEventNumber">-</div>
                    <button class="col homepageButtons subtleShadow currentEvents robotoButton" id="allEventsButton">All Events</button>
                </div>
            </div>
            <div class="col ">
                <div class="container row" id="upcomingEventsBox">
                    <div class="col innerShadow robotoButton homepageButtonNumber upcomingEvents" id="upcomingEventsNumber">-</div>
                    <button class="col robotoButton subtleShadow homepageButtons upcomingEvents" id="upcomingEventsButton">Upcoming Events</button>
                </div>
            </div>
            <div class="col " id="pastEventsBox">
                <div class="container row">
                    <div class="col innerShadow robotoButton homepageButtonNumber completedEvents" id="completedEventsNumber">-</div>
                    <button class="col subtleShadow robotoButton homepageButtons completedEvents"  id="completedEvents">Completed Events</button>
                </div>
            </div>
            <div class="col " id="currentlyHappeningBox">
                <div class="container row">
                    <div class="col innerShadow robotoButton homepageButtonNumber currentlyHappening" id="currentlyHappeningNumber">-</div>
                    <button class="col subtleShadow robotoButton homepageButtons currentlyHappening"  id="currentlyHappening">Current Events</button>
                </div>
            </div>
        </div>
        <div id="searchFor" class="row p-2">

            <div class="col-5">
                <label for="startDate" class="form-text">Start Date</label>
                <input class="form-control" type="date" id="startDate">
                <div class="form-text">Enter just a Start Date to see a single days events.</div>
            </div>
            <div class="col-5">
                <label for="endDate" class="form-text">End Date</label>
                <input style="width: " class=" form-control" type="date" id="endDate">
                <div class="form-text">Enter a Start Date and End Date to filter events between dates.</div>
            </div>

            <div class="col-2 align-self-center">
                <button id="searchDateButton" class="col-12  btn-sm subtleShadow btn btn-primary">Search</button>

            </div>

        </div>
        <div id="table" class="row">
            <div class="col" id="mainTable">
            </div>
        </div>
        <div id="footer" class="subtleShadow">
        </div>




    </div>




</body>

</html>