<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if(isset($data)) {
    // assign request properties from the decoded data
    $request->title = $data->title;
    $request->requesterId = $data->requesterId;
    $request->consultantId = $data->consultantId;
    $request->patientId = $data->patientId;
    $request->notes = $data->notes;

    // some data checks in case user bypassed on front-end
    if (empty($request->title)) {
      exit('Invalid title');
    }

    if (empty($request->consultantId)) {
      exit('Invalid consultantId');
    }
  
    if (empty($request->patientId)) {
      exit('Invalid pateintId');
    }

    // Create request on db. Retrieve and return the db id if successful
    if($request->create()) {
      $uniqueId = $db->lastInsertId();
      echo json_encode(
        array('dbId' => $uniqueId)
      );
    } else {
      echo json_encode(
        array('message' => 'Request Not Added')
      );
    }
  }
  