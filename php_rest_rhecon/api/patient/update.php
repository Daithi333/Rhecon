<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and Patient objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  $patient->id = $data->id;
  $patient->firstName = $data->firstName;
  $patient->lastName = $data->lastName;
  $patient->dob = $data->dob;
  $patient->notes = $data->notes;
  $patient->portraitUrl = $data->portraitUrl;
  $patient->userId = $data->userId;

  // Update patient
  if($patient->update()) {
    echo json_encode(
      array('message' => 'Patient Updated')
    );
  } else {
    echo json_encode(
      array('message' => 'Patient Not Updated')
    );
  }