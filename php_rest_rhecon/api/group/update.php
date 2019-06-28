<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate Group data object
  $group = new Group($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  $group->id = $data->id;
  $group->groupName = $data->groupName;
  $group->imageUrl = $data->imageUrl;

  // Update group
  if($group->update()) {
    echo json_encode(
      array('message' => 'Group Updated')
    );
  } else {
    echo json_encode(
      array('message' => 'Group Not Updated')
    );
  }