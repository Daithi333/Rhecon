<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  $request->id = $data->id;
  $request->title = $data->title;
  $request->consultantId = $data->consultantId;
  $request->patientId = $data->patientId;
  $request->notes = $data->notes;

  if (empty($request->title)) {
    exit('Invalid title');
  }

  if (empty($request->consultantId)) {
    exit('Invalid consultantId');
  }

  if (empty($request->patientId)) {
    exit('Invalid pateintId');
  }

  // Update request
  if($request->update()) {
    echo json_encode(
      array('message' => 'Request Updated')
    );
  } else {
    echo json_encode(
      array('message' => 'Request Not Updated')
    );
  }