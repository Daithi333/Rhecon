<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and group objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  $group->userId = $data->userId;
  $group->groupId = $data->groupId;
  $group->newAdminId = $data->newAdminId;

  // Update group admin
  if($group->setAdmin()) {

    if($group->removeAdmin()) {
      echo json_encode(
        array('message' => 'Admin Replaced Sucessfully')
      );

    } else {
      echo json_encode(
        array('message' => 'Admin Added Original Not Replaced')
      );
    };
    
  } else {
    echo json_encode(
      array('message' => 'Admin Not Updated')
    );
  }