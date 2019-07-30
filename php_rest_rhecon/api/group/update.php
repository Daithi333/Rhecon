<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and Group objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  $group->id = $data->id;
  $group->groupName = $data->groupName;
  $group->imageUrl = $data->imageUrl;

  // data check in case front-end was bypassed
  if ( empty($group->groupName) || (!preg_match("/^[0-9a-zA-Z'. -]*$/", $group->groupName)) ) {
    exit('Invalid groupName');
  }

  if (empty($group->imageUrl)) {
    exit('Invalid imageUrl');
  }

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