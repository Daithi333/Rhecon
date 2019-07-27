<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
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
    $user->id = $data->id;
    $user->titleId = $data->titleId;
    $user->firstName = $data->firstName;
    $user->lastName = $data->lastName;
    $user->specialismId = $data->specialismId;
    $user->portraitUrl = $data->portraitUrl;
    $user->bio = $data->bio;

    if ( empty($user->firstName) || (!preg_match("/^[a-zA-Z'. -]*$/", $user->firstName)) ) {
      exit('Invalid firstname');
    }

    if ( empty($user->lastName) || (!preg_match("/^[a-zA-Z'. -]*$/", $user->lastName)) ) {
      exit('Invalid lastname');
    }

    if (empty($user->portraitUrl)) {
      exit('Invalid portraitUrl');
    }

    // Update user profile
    if($user->update()) {
      echo json_encode(
        array('message' => 'Profile Updated')
      );
    } else {
      echo json_encode(
        array('message' => 'Profile Not Updated')
      );
    }

  }