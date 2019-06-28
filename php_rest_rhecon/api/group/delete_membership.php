<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and Group data objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  $group->userId = isset($_GET['userId']) ? $_GET['userId'] : die();
  $group->groupId = isset($_GET['groupId']) ? $_GET['groupId'] : die();

  // Delete request
  if($group->delete()) {
    echo json_encode(
      array('message' => 'Membership Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Membership Not Deleted')
    );
  }
  