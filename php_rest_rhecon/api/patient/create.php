<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and Patient record objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign patient properties from the decoded data
    $patient->firstName = $data->firstName;
    $patient->lastName = $data->lastName;
    $patient->dob = $data->dob;
    $patient->notes = $data->notes;
    $patient->portraitUrl = $data->portraitUrl;
    $patient->userId = $data->userId;

    if ( empty($patient->firstName) || (!preg_match("/^[a-zA-Z'. -]*$/", $patient->firstName)) ) {
      echo json_encode(array('message' => 'Invalid firstname'));
      exit(400);
    }

    if ( empty($patient->lastName) || (!preg_match("/^[a-zA-Z'. -]*$/", $patient->lastName)) ) {
      echo json_encode(array('message' => 'Invalid lastname'));
      exit(400);
    }

    if (empty($patient->portraitUrl)) {
      echo json_encode(array('message' => 'Invalid portraitUrl'));
      exit(400);
    }

    // Create patient on db. Retrieve and return the db id if successful
    if($patient->create()) {
      $uniqueId = $db->lastInsertId();
      echo json_encode(
        array('dbId' => $uniqueId)
      );
    } else {
      echo json_encode(
        array('message' => 'Patient Not Added')
      );
    }
  }