<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE, GET');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Group.php';

  // Instantiate DB and Group objects
  $database = new Database();
  $db = $database->connect();
  $group = new Group($db);

  $group->id = isset($_GET['id']) ? $_GET['id'] : die();
  $group->userId = isset($_GET['userId']) ? $_GET['userId'] : die();

  $group->groupId = $group->id;
  $membership = $group->readMembership();
  $count = $membership->rowCount();

  // only allow deletion if group has 1 member
  if ($count <= 1) {

    // delete the membership entry first
    if ($group->deleteMembership()) {

      // Delete group
      if($group->delete()) {
        http_response_code(200);
        echo json_encode(
          array('message' => 'Group Deleted')
        );

      } else {
        http_response_code(500);
        echo json_encode(
          array('message' => 'Group Not Deleted')
        );
      }

    } else {
      http_response_code(500);
      echo json_encode(
        array('message' => 'Membership not deleted')
      );
    }

  } else {
    http_response_code(400);
    echo json_encode(
      array('message' => 'Group has more than one member')
    );
  }
