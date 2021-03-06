<?php
  include '../token/check_token.php';

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
    $group->groupName = $data->groupName;
    $group->imageUrl = $data->imageUrl;
    $group->userId = $data->userId;

    // some data checks in case front-end was bypassed
    if ( empty($group->groupName) || (!preg_match("/^[0-9a-zA-Z'. -]*$/", $group->groupName)) ) {
      http_response_code(400);
      exit('Invalid groupName');
    }

    if (empty($group->imageUrl)) {
      http_response_code(400);
      exit('Invalid imageUrl');
    }

    // Create Group on db. Retrieve and return the db id if successful
    if($group->create()) {
      $uniqueId = $db->lastInsertId();
      $group->groupId = $uniqueId;

      if($group->createMembership(1)) {
        $uniqueId2 = $db->lastInsertId();

        echo json_encode(
          array(
            'dbId' => $uniqueId,
            'dbId2' => $uniqueId2
          )
        );

      } else {
        echo json_encode(
          array('message' => 'Membership Not Added')
        );
      }
      
    } else {
      echo json_encode(
        array('message' => 'Group Not Added')
      );
    }
  }