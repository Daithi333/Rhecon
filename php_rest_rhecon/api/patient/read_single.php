<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and Patient objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

  include '../token/check_token.php';

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

    http_response_code(200);
    print_r(json_encode($patientArr));  

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No patients found')
    );
  }

   
