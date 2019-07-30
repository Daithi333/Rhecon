<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and Group objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  // get user id from URL
  $group->userId = isset($_GET['userId']) ? $_GET['userId'] : die();

  // group lookup query per user id
  $result = $group->read();

  $count = $result->rowCount();

  // check if any groups
  if($count > 0) {
    $groupArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $groupElement = array(
        'id' => $id,
        'groupName' => $groupName,
        'imageUrl' => $imageUrl,
        'isAdmin' => $isAdmin
      );

      array_push($groupArr, $groupElement);
    }

    http_response_code(200);
    echo json_encode($groupArr);

    } else {
      http_response_code(204);
      echo json_encode(
        array('message' => 'No groups found')
      );
  }