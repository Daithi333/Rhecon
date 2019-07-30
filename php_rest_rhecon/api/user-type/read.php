<?php
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    exit();
  }
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/UserType.php';

  // Instantiate DB and UserType objects
  $database = new Database();
  $db = $database->connect();
  $userType = new UserType($db);

  // user type lookup query
  $result = $userType->read();

  $count = $result->rowCount();

  // check if any user types
  if($count > 0) {
    $userTypeArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $userTypeElement = array(
        'id' => $id,
        'userType' => $userType
      );

      array_push($userTypeArr, $userTypeElement);
    }

    http_response_code(200);
    echo json_encode($userTypeArr);

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No user types found')
    );
  }