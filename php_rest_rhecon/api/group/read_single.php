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

  // get contact id from URL
  $group->id = isset($_GET['id']) ? $_GET['id'] : die();
  $group->userId = isset($_GET['userId']) ? $_GET['userId'] : die();

  if ($group->readSingle()) {
    $groupArr = array(
      'id' => $group->id,
      'groupName' => $group->groupName,
      'imageUrl' => $group->imageUrl,
      'isAdmin' => $group->isAdmin,
    );

    http_response_code(200);
    print_r(json_encode($groupArr));

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No group found')
    );
  }

   
