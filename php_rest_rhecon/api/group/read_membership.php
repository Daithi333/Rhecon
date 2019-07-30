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

  // get group id from URL
  $group->groupId = isset($_GET['groupId']) ? $_GET['groupId'] : die();

  // group membership lookup query per group id
  $result = $group->readMembership();

  $count = $result->rowCount();

  // check if any membership
  if($count > 0) {
    $groupArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      array_push($groupArr, $userId);
    }

    http_response_code(200);
    echo json_encode($groupArr);

    } else {
      http_response_code(204);
      echo json_encode(
        array('message' => 'No members found')
      );
  }