<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate Patient data object
  $patient = new Patient($db);

  // get patient id from URL
  $patient->userId = isset($_GET['userId']) ? $_GET['userId'] : die();
  $patient->id = isset($_GET['id']) ? $_GET['id'] : die();

  if ($patient->readSingle()) {
    $patientArr = array(
      'id' => $patient->id,
      'firstName' => $patient->firstName,
      'lastName' => $patient->lastName,
      'dob' => $patient->dob,
      'notes' => $patient->notes,
      'portraitUrl' => $patient->portraitUrl,
      'userId ' => $patient->userId  
    );

    print_r(json_encode($patientArr));  

  } else {
    // echo json_encode(
    //   array('message' => 'No patients found')
    // );
  }

   
