<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Patient record objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  // get requester id from URL
  $request->requesterId = isset($_GET['requesterId']) ? $_GET['requesterId'] : die();

  // request lookup query per requester
  $result = $request->read();

  $count = $result->rowCount();

  // check if any patients
  if($count > 0) {
    $requestArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $bool = ($row['active'] == 1 ? true : false);

      $requestElement = array(
        'id' => $id,
        'title' => $title,
        'requesterId' => $requesterId,
        'consultantId' => $consultantId,
        'patientId' => $patientId,
        'notes' => $notes,
        'active' => $bool,
        'createdOn' => $createdOn,
        'updatedOn' => $updatedOn
      );

      array_push($requestArr, $requestElement);
    }

     // output as JSON
    echo json_encode($requestArr);

  // } else {
  //   echo json_encode(
  //     array('message' => 'No patients found')
  //   );
  }