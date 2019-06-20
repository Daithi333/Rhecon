<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../config/secure.php';
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
    $password = $data->password;

    // Create user on db and generate auth token
    if($user->readSingle()) {

      // verify entered password against hashed password from DB
      if (password_verify($password, $user->password)) {
        
        // TODO - add proper token generation
        // $token = bin2hex(random_bytes(64));

        echo json_encode(
          array(
            'message' => 'Success',
            'idToken' => 'Bearer ' . $token,
            'email' => $user->email,
            'expiresIn' => '3600000'
          )
        );

      } else {
        echo json_encode(
          array('message' => 'Password incorrect')
        );
      }
     
    } else {
      echo json_encode(
        array('message' => 'User not found')
      );
    }
  }
  