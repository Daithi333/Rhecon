<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request record objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  // get requester or consultant id from Url, depending on which was sent
  if (isset($_GET['requesterId'])) {
    $request->requesterId = $_GET['requesterId'];
    $result = $request->read();

  } else if (isset($_GET['consultantId'])) {
    $request->consultantId = $_GET['consultantId'];
    $result = $request->readConsultant();

  } else {
    die();
  }

  $count = $result->rowCount();

  // check if any requests
  if($count > 0) {
    $requestArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $requestElement = array(
        'id' => $id,
        'title' => $title,
        'requesterId' => $requesterId,
        'consultantId' => $consultantId,
        'patientId' => $patientId,
        'notes' => $notes,
        'active' => $active,
        'createdOn' => $createdOn,
        'updatedOn' => $updatedOn
      );

      array_push($requestArr, $requestElement);
    }

    // output as JSON
    http_response_code(200);
    echo json_encode($requestArr);

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No requests found')
    );
  }