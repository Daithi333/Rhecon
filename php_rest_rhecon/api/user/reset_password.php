<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/User.php';

  // Instantiate DB and User objects
  $database = new Database();
  $db = $database->connect();
  $user = new User($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    $user->email = $data->email;

    $headers = "From: Rhecon" . "\r\n";
    $body = "Hello,\n\n
    You have requested a password reset for the Rhecon app.\n\n
    Please click on the below link to proceed:\n\n
    " . $invitation->groupName . "\n\n\n

    Regards,\n
    The Rhecon Team";

    // send email
    mail($invitation->recipient,"Password Reset", $body, $headers);

    echo json_encode(
      array('message' => 'Email sent')
    );

  } else {
    echo json_encode(
      array('message' => 'Email Not Sent')
    );
  }