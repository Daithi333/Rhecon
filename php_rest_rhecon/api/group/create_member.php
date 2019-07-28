<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and Group objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign Group properties from the decoded data
    $group->userId = $data->userId;
    $group->groupId = $data->groupId;

    if($group->createMembership(0)) {
      $uniqueId = $db->lastInsertId();

      echo json_encode(
        array('dbId' => $uniqueId)
      );

    } else {
      echo json_encode(
        array('message' => 'Member not Added')
      );
    }

  }