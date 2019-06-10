<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Patient.php';

  // Instantiate DB and Patient data objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

  $patient->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Update request
  if($patient->closePatient()) {
    echo json_encode(
      array('message' => 'Patient Record Closed')
    );
  } else {
    echo json_encode(
      array('message' => 'Patient Record Not Closed')
    );
  }