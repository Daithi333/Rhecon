<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/User.php';

  // Instantiate DB and user objects
  $database = new Database();
  $db = $database->connect();
  $user = new User($db);

  // get user id from URL
  $user->id = isset($_GET['id']) ? $_GET['id'] : die();

  if ($user->readProfile()) {
    $userArr = array(
      'id' => $user->id,
      'titleId' => $user->titleId,
      'firstName' => $user->firstName,
      'lastName' => $user->lastName,
      'specialismId' => $user->specialismId,
      'portraitUrl' => $user->portraitUrl,
      'bio' => $user->bio
    );

    http_response_code(200);
    print_r(json_encode($userArr));

  } else {
    http_response_code(404);
    echo json_encode(
      array('message' => 'No profile found')
    );
  }

   
