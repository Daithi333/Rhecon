<?php
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

  // get contact id from URL
  $contact->id = isset($_GET['id']) ? $_GET['id'] : die();

  if ($contact->readSingle()) {
    $contactArr = array(
      'id' => $contact->id,
      'title' => $contact->title,
      'firstName' => $contact->firstName,
      'lastName' => $contact->lastName,
      'specialism' => $contact->specialism,
      'portraitUrl' => $contact->portraitUrl,
      'bio' => $contact->bio
    );

    print_r(json_encode($contactArr));

  } else {
    // echo json_encode(
    //   array('message' => 'No patients found')
    // );
  }

   
