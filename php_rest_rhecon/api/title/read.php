<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Title.php';

  // Instantiate DB and title objects
  $database = new Database();
  $db = $database->connect();
  $title = new Title($db);

  // titles lookup query
  $result = $title->read();

  $count = $result->rowCount();

  // check if any titles
  if($count > 0) {
    $titleArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $titleElement = array(
        'id' => $id,
        'title' => $title
      );

      array_push($titleArr, $titleElement);
    }

    http_response_code(200);
    echo json_encode($titleArr);

    } else {
      http_response_code(204);
      echo json_encode(
        array('message' => 'No titles found')
      );
  }