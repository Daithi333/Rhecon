<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  // get request id from URL
  $request->id = isset($_GET['id']) ? $_GET['id'] : die();

  // get requester or consultant id from Url, depending on which was sent
  if (isset($_GET['requesterId'])) {
    $request->requesterId = $_GET['requesterId'];
    $result = $request->readSingle();

  } else if (isset($_GET['consultantId'])) {
    $request->consultantId = $_GET['consultantId'];
    $result = $request->readSingleConsultant();

  } else {
    die();
  }

  if ($result) {
    $requestArr = array(
      'id' => $request->id,
      'title' => $request->title,
      'requesterId' => $request->requesterId,
      'consultantId' => $request->consultantId,
      'patientId' => $request->patientId,
      'notes' => $request->notes,
      'active' => $request->active,
      'createdOn' => $request->createdOn,
      'updatedOn' => $request->updatedOn
    );

    http_response_code(200);
    print_r(json_encode($requestArr));  

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No patients found')
    );
  }

   
