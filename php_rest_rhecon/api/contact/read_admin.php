<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Contact.php';

  // Instantiate DB and Contact objects
  $database = new Database();
  $db = $database->connect();
  $contact = new Contact($db);

  // get contact id from URL
  $contact->id = isset($_GET['id']) ? $_GET['id'] : die();

  if ($contact->readAdmin()) {
    $contactArr = array(
      'id' => $contact->id,
      'title' => $contact->title,
      'firstName' => $contact->firstName,
      'lastName' => $contact->lastName,
      'specialism' => $contact->specialism,
      'email' => $contact->email,
      'portraitUrl' => $contact->portraitUrl,
      'bio' => $contact->bio
    );

    http_response_code(200);
    print_r(json_encode($contactArr));

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No Contact found')
    );
  }

   
