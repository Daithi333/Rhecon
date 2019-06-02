<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and Patient record objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

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

     // output as JSON
    echo json_encode($patientArr);

  // } else {
  //   echo json_encode(
  //     array('message' => 'No patients found')
  //   );
  }