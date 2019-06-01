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

  // assign patient properties from the decoded data
  $patient->firstName = $data->firstName;
  $patient->lastName = $data->lastName;
  $patient->dob = $data->dob;
  $patient->notes = $data->notes;
  $patient->portraitUrl = $data->portraitUrl;
  $patient->userId = $data->userId;

  // Create patient on db. Retrieve and return the db id if successful
  if($patient->create()) {
    $uniqueId = $db->lastInsertId();
    echo json_encode(
      array('UniqueId' => $uniqueId)
    );
  } else {
    echo json_encode(
      array('message' => 'Patient Not Added')
    );
  }