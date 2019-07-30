<?php
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    exit();
  }

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
    $user->password = $data->password;

    // some data checks in case user bypassed on front-end
    if ( ($user->userTypeId == 2) && ($user->specialismId != 1) ) {
      http_response_code(400);
      exit('Invalid specialism');
    }

    if ( empty($user->firstName) || (!preg_match("/^[a-zA-Z'. -]*$/", $user->firstName)) ) {
      http_response_code(400);
      exit('Invalid firstname');
    }

    if ( empty($user->lastName) || (!preg_match("/^[a-zA-Z'. -]*$/", $user->lastName)) ) {
      http_response_code(400);
      exit('Invalid lastname');
    }

    if ( empty($user->email) || (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) ) {
      http_response_code(400);
      exit('Invalid email');
    }

    if ( empty($user->password) || (!preg_match("/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/", $user->password)) ) {
      http_response_code(400);
      exit('Invalid password');
    }

    // check if email is already registered before registering
    if ($user->readSingle()) {
      http_response_code(400);
      exit('Email already registered');
    }

    // hash the password if all the checks have succeeded
    $user->password = password_hash($data->password, PASSWORD_DEFAULT);

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

  }