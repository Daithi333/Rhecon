<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Specialism.php';

  // Instantiate DB and Specialism record objects
  $database = new Database();
  $db = $database->connect();
  $specialism = new Specialism($db);

  // specialism lookup query
  $result = $specialism->read();

  $count = $result->rowCount();

  // check if any specialisms
  if($count > 0) {
    $specialismArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $specialismElement = array(
        'id' => $id,
        'specialism' => $specialism
      );

      array_push($specialismArr, $specialismElement);
    }

    http_response_code(200);
    echo json_encode($specialismArr);

    } else {
      http_response_code(204);
      echo json_encode(
        array('message' => 'No specialisms found')
      );
  }