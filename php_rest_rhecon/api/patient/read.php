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
  
  // get user id from URL
  $patient->userId = isset($_GET['userId']) ? $_GET['userId'] : die();

  // patient lookup query per user id
  $result = $patient->read();

  $count = $result->rowCount();

  // check if any patients
  if($count > 0) {
    $patientArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $patientElement = array(
        'id' => $id,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'dob' => $dob,
        'notes' => $notes,
        'portraitUrl' => $portraitUrl,
        'userId' => $userId
      );

      array_push($patientArr, $patientElement);
    }

    http_response_code(200);
    // output as JSON
    echo json_encode($patientArr);

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No patients found')
    );
  }
