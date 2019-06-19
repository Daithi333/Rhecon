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
    $user->titleId = $data->titleId;
    $user->firstName = $data->firstName;
    $user->lastName = $data->lastName;
    $user->userTypeId = $data->userTypeId;
    $user->specialismId = $data->specialismId;
    $user->email = $data->email;
    $user->password = password_hash($data->password, PASSWORD_DEFAULT);

    // check if email is already in use before creating user
    if (!$user->readSingle()) {

      // Create user on db returning the db id if successful
      if($user->create()) {
        
        $uniqueId = $db->lastInsertId();
        http_response_code(200);
        echo json_encode(
          array(
            'message' => 'User successfully registered',
            'dbId' => $uniqueId
          )
        );

      } else {
        http_response_code(400);
        echo json_encode(
          array('message' => 'Unable to register user')
        );
      }

    } else {
      http_response_code(400);
        echo json_encode(
          array('message' => 'Email address already registered')
        );
    }

  }