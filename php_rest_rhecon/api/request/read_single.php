<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request data objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  // get request id from URL
  $request->requesterId = isset($_GET['requesterId']) ? $_GET['requesterId'] : die();
  $request->id = isset($_GET['id']) ? $_GET['id'] : die();

  if ($request->readSingle()) {
    $requestArr = array(
      'id' => $request->id,
      'title' => $request->title,
      'requesterId' => $request->requesterId,
      'consultantId' => $request->consultantId,
      'patientId' => $request->patientId,
      'notes' => $request->notes,
      'active ' => $request->active,
      'createdOn ' => $request->createdOn,
      'updatedOn ' => $request->updatedOn
    );

    print_r(json_encode($requestArr));  

  } else {
    // echo json_encode(
    //   array('message' => 'No patients found')
    // );
  }

   
