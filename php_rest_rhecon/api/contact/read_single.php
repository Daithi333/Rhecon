<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Contact.php';

  // Instantiate DB and connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate Contact data object
  $contact = new Contact($db);

  // get contact id and userId from URL
  $contact->userId = isset($_GET['userId']) ? $_GET['userId'] : die();
  $contact->id = isset($_GET['id']) ? $_GET['id'] : die();

  if ($contact->readSingle()) {
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
      array('message' => 'No Contacts found')
    );
  }

   
