<?php
$hostname = "127.0.0.1";
$database = "tserver";
$username = "root";
$password = "mysql";

//new connection to database
$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error) {
    die($conn->connect_error);
}

//try {
//    $data = new PDO('mysql:host=$hostname;database=$database',$username, $password);
//    $data->setAttribute(PDO::ATTR_ERRMODE, PDO:: ERRMODE_EXCEPTION);
//}
//catch(PDOException $e){
//    echo "Connection failed : ". $e->getMessage();
//}

/** Gets all the events in the database.
 * @param mysqli $conn The connection to the database
 * @return array|null Returns an array of events or null.
 */
function getAllEvents($conn){
    $query = "CALL select_all_display_view()";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();

        foreach ($sqlArray as $item){
            $each = array();
            $each["event_name"] = $item[0];
            $each["cluster_name"] = $item[1];
            $each["date"] = $item[2];
            $each["time"] = $item[3];
            $each["activate"] = $item[4];
            $each["machine_group"] = $item[5];
            $each["time_offset"] = $item[6];
            $each["event_id"] = $item[7];
            $each["group_id"] = $item[8];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Gets an events id from the events name
 * @param mysqli $conn connection to the database.
 * @param String $eventName The event name.
 * @return array|null Returns an array with the event id or Null.
 */
function getEventId($conn, $eventName){
    $query = "CALL get_event_id('$eventName')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_id"] = $item[0];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}


/** Gets all the events on a date.
 * @param mysqli $conn The database connection.
 * @param String $date The date.
 * @return array|null
 */
function getEventsOnDate($conn, $date){
    $query = "CALL get_events_on_date('$date')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_name"] = $item[0];
            $each["cluster_name"] = $item[1];
            $each["date"] = $item[2];
            $each["time"] = $item[3];
            $each["activate"] = $item[4];
            $each["machine_group"] = $item[5];
            $each["time_offset"] = $item[6];
            $each["event_id"] = $item[7];
            $each["group_id"] = $item[8];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}


/** Gets all the events in between two dates.
 * @param  mysqli $conn The connection to the database.
 * @param String $date The date to start.
 * @param String $endDate The date to end.
 * @return array|null
 */
function getEventsOnDateToDate($conn, $date, $endDate){
    $query = "CALL get_events_on_date_to_date('$date', '$endDate')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_name"] = $item[0];
            $each["cluster_name"] = $item[1];
            $each["date"] = $item[2];
            $each["time"] = $item[3];
            $each["activate"] = $item[4];
            $each["machine_group"] = $item[5];
            $each["time_offset"] = $item[6];
            $each["event_id"] = $item[7];
            $each["group_id"] = $item[8];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Gets all the clusters names.
 * @param mysqli $conn The database connection.
 * @return array|null
 */
function getClusterNames($conn){
    $query = "CALL get_all_clusters()";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["cluster_id"] = $item[0];
            $each["cluster_name"] = $item[1];
            $each["cluster_description"] = $item[2];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Gets all the client groups names.
 * @param mysqli $conn The Database connection.
 * @return array|null
 */
function getGroupNames($conn){
    $query = "CALL get_groups()";
    $result = mysqli_multi_query($conn,$query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["group_id"] = $item[0];
            $each["machine_group"] = $item[1];
            $returnArray[] = $each;
        }

        return $returnArray;
    }

    return null;
}


/** Inserts into the database the event name.
 * @param mysqli $conn The Database connection
 * @param String $name The Event name.
 */
function insert_into_events($conn, $name){
    $query = "CALL insert_into_front_event('$name')";
    $result = mysqli_multi_query($conn, $query);


}

/** Gets all the Event names.
 * @param mysqli $conn The Database connection.
 * @return array|null
 */
function getEventNames($conn){
    $query = "CALL get_event_names()";
    $result = mysqli_multi_query($conn,$query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_id"] = $item[0];
            $each["event_name"] = $item[1];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Inserts into front_weekly.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @param Int $weekOfYear The week of the year.
 * @param Int $eventYear The event year.
 */
function insert_into_front_weekly($conn, $eventId, $weekOfYear, $eventYear){
    $query = "CALL insert_into_front_weekly('$eventId', '$weekOfYear', '$eventYear')";
    $result = mysqli_multi_query($conn, $query);

}

/** Inserts into front_daily.
 * @param mysqli $conn The Database connection.
 * @param Int $event_id The event Id.
 * @param Int $groupId The group Id.
 * @param Int $dayOfWeek The day of the week.
 * @param String $startTime The start time.
 */
function insert_into_front_daily($conn, $event_id, $groupId, $dayOfWeek, $startTime){
    $query = "CALL insert_into_front_daily('$event_id', '$groupId', '$dayOfWeek', '$startTime')";
    $result = mysqli_multi_query($conn, $query);

}

/** Inserts into front_action
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @param String $timeOffset Event time offset.
 * @param Int $clusterId Cluster Id.
 * @param Int $activate 1 or 0, if event is to active or not on this time.
 */
function insert_into_front_action($conn, $eventId, $timeOffset, $clusterId, $activate){
    $query = "CALL insert_into_front_action('$eventId','$timeOffset','$clusterId','$activate')";
    $result = mysqli_multi_query($conn, $query);

}

/** This function creates the full event, calls necessary other functions.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @param String $eventLength Event Length
 * @param String $date Event Date.
 * @param String $time Event starting time.
 * @param String $offset Cluster activation offset.
 * @param Array $machineGroups Array of event machine groups.
 * @param Int $clusterId Cluster id.
  */
function createFullEvent($conn, $eventId, $eventLength, $date, $time, $offset, $machineGroups, $clusterId){
    $date = str_split($date);
    $year = (int)implode("",array_slice($date, 0, 4));
    $day = (int)implode("",array_slice($date, 8, 2));
    $month = (int)implode("",array_slice($date, 5, 2));
    $unixDate = mktime(0,0,0, $month, $day, $year);
    $weekOfYear = date("W", $unixDate);
    $dayOfWeek = date("w", $unixDate);
    insert_into_front_weekly($conn, $eventId, $weekOfYear, $year);
    foreach ($machineGroups as $iValue) {
        insert_into_front_daily($conn, $eventId, $iValue, $dayOfWeek, $time);
    }
    insert_into_front_action($conn, $eventId, $offset, 3, 0);
    insert_into_front_action($conn, $eventId, $offset, $clusterId, 1);
    insert_into_front_action($conn, $eventId, $eventLength, 3, 1);
    insert_into_front_action($conn, $eventId, $eventLength, $clusterId, 0);

}

/** Gets the event from the event_id.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @return array|null
 */
function getEventFromId($conn,$eventId){
    $query = "CALL select_event_from_id('$eventId')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();

        foreach ($sqlArray as $item){
            $each = array();
            $each["time_offset"] = $item[0];
            $each["event_id"] = $item[1];
            $each["event_name"] = $item[2];
            $each["date"] = $item[3];
            $each["time"] = $item[4];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Gets an array of events based off a portion of event_name.
 * @param mysqli $conn The Database connection.
 * @param String $string The portion of an event name to look for.
 * @return array|null
 */
function getEventByStr($conn, $string) {
    //SQL statement to get all event details from database
    $searchString = '%'.$string.'%';
    $query = "CALL get_event_by_string('$searchString')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();

    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();

        foreach ($sqlArray as $item){
            $each = array();
            $each["event_name"] = $item[0];
            $returnArray[] = $each;
        }
        return $returnArray;
    }
    return null;
}

/** Gets every events Id.
 * @param mysqli $conn The Database connection.
 * @return array|null
 */
function getAllEventId($conn){
    $query = "CALL get_all_event_id()";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_id"] = $item[0];
            $each["event_name"] = $item[1];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}


/** Gets all the cluster actions from an event.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @return array|null
 */
function getClusterAction($conn, $eventId){
    $query = "CALL get_cluster_actions_from_id('$eventId')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_id"] = $item[1];
            $each["time_offset"] = $item[2];
            $each["cluster_id"] = $item[3];
            $each["cluster_status"] = $item[4];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Gets the group of computers running the event.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @return array|null
 */
function getClientGroupFromEventId($conn, $eventId){
    $query = "CALL get_client_group_from_event_id('$eventId')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["machine_group"] = $item[0];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Gets the data an event is running on.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event Id.
 * @return array|null
 */
function getEventDate($conn, $eventId){
    $query = "CALL get_event_date_time('$eventId')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["date"] = $item[1];
            $each["time"] = $item[0];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;

}

/** Gets all events with the same name.
 * @param mysqli $conn The Database connection.
 * @param Int $eventName The event Id.
 * @return array|null
 */
function getEventsThatMatchName($conn, $eventName){
    $query = "CALL get_all_events_that_match_name('$eventName')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["event_name"] = $item[0];
            $each["cluster_name"] = $item[1];
            $each["date"] = $item[2];
            $each["time"] = $item[3];
            $each["activate"] = $item[4];
            $each["machine_group"] = $item[5];
            $each["time_offset"] = $item[6];
            $each["event_id"] = $item[7];
            $each["group_id"] = $item[8];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Deletes an Event.
 * @param mysqli $conn The Database connection.
 * @param Int $item The event Id.
 * @return string Indicates if success or not.
 */
function deleteItem($conn, $item){
    $query = "CALL delete_from_id('$item')";
    $result = mysqli_multi_query($conn, $query);
    return "Success";

}

/** Gets the actions associated with an event.
 * @param mysqli $conn The Database connection.
 * @param Int $eventId The event id.
 * @return array|null
 */
function getEventActions($conn, $eventId){
    $query = "CALL get_event_actions('$eventId')";
    $result = mysqli_multi_query($conn, $query);
    $returnArray = array();
    if ($result = $conn->store_result()){
        $sqlArray = $result->fetch_all();
        $result->free();


        foreach ($sqlArray as $item){
            $each = array();
            $each["action_id"] = $item[0];
            $each["event_id"] = $item[1];
            $each["time_offset"] = $item[2];
            $each["cluster_id"] = $item[3];
            $each["activate"] = $item[4];
            $returnArray[] = $each;
        }

        return $returnArray;
    }
    return null;
}

/** Updates an events actions
 * @param mysqli $conn The Database connection.
 * @param Int $actionId The id of the action
 * @param String $timeOffset The new time offset
 * @param Int $clusterId The new cluster id.
 * @return string
 */
function updateEventAction($conn, $actionId, $timeOffset, $clusterId){
    $query = "CALL update_event_action('$timeOffset', '$clusterId', '$actionId')";
    $result = mysqli_multi_query($conn, $query);
    return "Updated";
}


/**
 * A function to authenticate whether the username and the password inputted by the user is stored in database
 * Go to index.php if passed
 * otherwise display error in login.php
 * @param String $username username input from user
 * @param String $password password input from the user
 */
function authenticate($username, $password) {
    global $conn;
    $query = "SELECT * FROM user WHERE username='" . $username  . "' and password='".md5($password)."'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    if (count($row)===0){
        header("Location: login.php?error=Incorrect username or password");
    }
    else{
        session_start();
        $_SESSION['loggedin'] = true;
        header("Location: index.php");
    }
}

/**
 * The switching statement that controls the flow.
 * Calls functions depending on the "command" word.
 */
if (!empty(($_POST))) {
    switch ($_POST["command"]) {
        case "getEventClusterList":
            echo json_encode(getClusterNames($conn));
            break;
        case "getGroups":
            echo json_encode(getGroupNames($conn));
            break;
        case "getEventNames":
            echo json_encode(getEventNames($conn));
            break;
        case "insertEvent":
            $eventName = $_POST['data'];
            insert_into_events($conn, $eventName);
            echo json_encode(getEventId($conn, $eventName));
            break;
        case "submitEvent":
            $eventId = $_POST["event_id"];
            $eventLength = $_POST["eventLength"];
            $date = $_POST["date"];
            $time = $_POST["time"];
            $time .= ":00";
            $offset = $_POST["offset"];
            $machineGroups = $_POST["machineGroups"];
            $clusterId = $_POST["cluster_id"];
            createFullEvent($conn, $eventId, $eventLength, $date, $time, $offset, $machineGroups, $clusterId);
            break;

        case "getEvents":
            echo json_encode(getAllEvents($conn));
            break;
        case "getAllEventId":
            echo json_encode(getAllEventId($conn));
            break;
        case "searchString":
            echo json_encode(getEventByStr($conn, $_POST['string']));
            break;
        case "getClusterEventFromId":
            echo json_encode(getClusterAction($conn, $_POST['event_id']));
            break;
        case "getClientGroupFromId":
            echo json_encode(getClientGroupFromEventId($conn, $_POST['event_id']));
            break;
        case "getEventDate":
            echo json_encode(getEventDate($conn, $_POST['event_id']));
            break;
        case "getEventsOnDate":
            echo json_encode(getEventsOnDate($conn, $_POST['date']));
            break;
        case "getEventsOnDateToDate":
            echo json_encode(getEventsOnDateToDate($conn, $_POST['startDate'], $_POST['endDate']));
            break;
        case "getEventsThatMatchName":
            echo json_encode(getEventsThatMatchName($conn, $_POST['eventName']));
            break;
        case "getEventFromId":
            echo json_encode(getEventFromId($conn, $_POST['eventId']));
            break;
        case "delete":
            echo json_encode(deleteItem($conn, $_POST["event_id"]));
            break;
        case "getEventActions":
            echo json_encode(getEventActions($conn, $_POST["event_id"]));
            break;
        case "updateEventAction":
            echo json_encode(updateEventAction($conn, $_POST['action_id'], $_POST['time_offset'], $_POST['cluster_id']));
            break;


    }




}



