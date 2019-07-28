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
    $invitation->id = $data->id;

    if($invitation->invalidate()) {
      http_response_code(200);
        echo json_encode(
          array('message' => 'Code successfully invalidated')
        );

    } else {
        echo json_encode(
          array('message' => 'Invalidation unsuccessful')
        );

    }
  }
    