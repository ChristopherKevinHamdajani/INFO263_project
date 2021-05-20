<?php
$hostname = "127.0.0.1";
$database = "tserver";
$username = "root";
$password = "mysql";

//new connection to database
$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error)
{
    fatalError($conn->connect_error);
    return;
}



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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}


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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }

}


function getRooms($conn)
{
    //SQL statement to get all event details from database
    $query = "CALL show_rooms()";
    $result = mysqli_multi_query($conn, $query);
    if ($result = $conn->store_result()){
        $resultsArray = $result->fetch_all();
        $result->free(); // Frees the memory
        return $resultsArray;
    } else {
        return null;
    }
}


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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}

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
            $each["date"] = $item[2];t
            $each["time"] = $item[3];
            $each["activate"] = $item[4];
            $each["machine_group"] = $item[5];
            $each["time_offset"] = $item[6];
            $each["event_id"] = $item[7];
            $each["group_id"] = $item[8];
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}

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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}


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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}



function insert_into_events($conn, $name){
    $query = "CALL insert_into_front_event('$name')";
    $result = mysqli_multi_query($conn, $query);


}


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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}


function insert_into_front_weekly($conn, $eventId, $weekOfYear, $eventYear){
    $query = "CALL insert_into_front_weekly('$eventId', '$weekOfYear', '$eventYear')";
    $result = mysqli_multi_query($conn, $query);

}

function insert_into_front_daily($conn, $event_id, $groupId, $dayOfWeek, $startTime){
    $query = "CALL insert_into_front_daily('$event_id', '$groupId', '$dayOfWeek', '$startTime')";
    $result = mysqli_multi_query($conn, $query);

}

function insert_into_front_action($conn, $eventId, $timeOffset, $clusterId, $activate){
    $query = "CALL insert_into_front_action('$eventId','$timeOffset','$clusterId','$activate')";
    $result = mysqli_multi_query($conn, $query);

}


function createFullEvent($conn, $eventId, $eventLength, $date, $time, $offset, $machineGroups, $clusterId){
    $date = str_split($date);
    $year = (int)implode("",array_slice($date, 0, 4));
    $day = (int)implode("",array_slice($date, 8, 2));
    $month = (int)implode("",array_slice($date, 5, 2));
    $unixDate = mktime(0,0,0, $month, $day, $year);
    $weekOfYear = date("W", $unixDate);
    $dayOfWeek = date("w", $unixDate);
    insert_into_front_weekly($conn, $eventId, $weekOfYear, $year);
    for($i = 0, $iMax = count($machineGroups); $i < $iMax; ++$i){
        insert_into_front_daily($conn, $eventId, $machineGroups[$i], $dayOfWeek, $time);
    }
    insert_into_front_action($conn, $eventId, $offset, 3, 0);
    insert_into_front_action($conn, $eventId, $offset, $clusterId, 1);
    insert_into_front_action($conn, $eventId, $eventLength, 3, 1);
    insert_into_front_action($conn, $eventId, $eventLength, $clusterId, 0);

}

function getEventByStr($conn, $string) {
    //SQL statement to get all event details from database
    $sqlString = $string;
    $query = "select event_name from vw_front_event where event_name like '$string%' order by date, cluster_id, group_id ";
    $result = mysqli_query($conn, $query);
    $results = array();
    $events = array();

    while($row = $result->fetch_array(MYSQLI_ASSOC)) {
        //make an array for current event state with all details
        $each = array();

        $each['event_name'] = $row['event_name'];


        array_push($results, $each);

    }
    return $results;
}


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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }
}



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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }

}

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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }

}

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
            array_push($returnArray, $each);
        }

        return $returnArray;
    }

}


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
    }
}



