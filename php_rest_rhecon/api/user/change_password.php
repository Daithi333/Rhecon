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
    // assign user properties from the decoded data
    $user->email = $data->email;
    $currentPassword = $data->currentPassword;
    $newPassword = $data->newPassword;

    // Check if user is on db
    if($user->readSingle()) {

      // verify entered password against hashed password from DB
      if (password_verify($currentPassword, $user->password)) {

        $user->password = password_hash($newPassword, PASSWORD_DEFAULT);

        if ($user->updatePassword()) {
          http_response_code(200);
          echo json_encode(
            array('message' => 'Password changed')
          );

        } else {
          http_response_code(500);
          echo json_encode(
            array('message' => 'Password not changed')
          );
        }

      } else {
        http_response_code(400);
        echo json_encode(
          array('message' => 'Password incorrect')
        );
      }
     
    } else {
      http_response_code(404);
      echo json_encode(
        array('message' => 'User not found')
      );
    }
  }
  