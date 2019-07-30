<?php  
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