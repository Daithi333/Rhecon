<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Invitation.php';

  // Instantiate DB and Invitation objects
  $database = new Database();
  $db = $database->connect();
  $invitation = new Invitation($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    $invitation->inviteCode = $data->inviteCode;

    if ($invitation->readSingle()) {

      $expiry = strtotime($invitation->expiresOn);
      $time = time();

      if ( ($invitation->isValid == 1) && ($expiry > $time) ) {

        $invitationArr = array(
          'id' => $invitation->id,
          'groupId' => $invitation->groupId
        );
        // $invitation->invalidate();
        http_response_code(200);
        print_r(json_encode($invitationArr));

      } else if ( ($invitation->isValid == 1) && ($expiry < $time) ) {

        $invitation->invalidate();

        http_response_code(401);
        echo json_encode(
          array('message' => 'Code has expired')
        );

      } else {
        http_response_code(401);
          echo json_encode(
            array('message' => 'Code is no longer valid')
          );
      } 
  
    } else {
      http_response_code(404);
      echo json_encode(
        array('message' => 'Code not found')
      );
    }

  }