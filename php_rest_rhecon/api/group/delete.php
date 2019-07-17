<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and Group objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  $group->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Delete group
  if($group->delete()) {
    echo json_encode(
      array('message' => 'Group Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Group Not Deleted')
    );
  }
  