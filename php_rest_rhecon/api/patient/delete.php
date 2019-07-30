<?php
  include '../token/check_token.php';

  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and Patient objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  $patient->id = $data->id;

  // Delete patient
  if($patient->delete()) {
    echo json_encode(
      array('message' => 'Patient Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Patient Not Deleted')
    );
  }
  