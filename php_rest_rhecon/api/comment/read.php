<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Comment.php';

  // Instantiate DB and Comment objects
  $database = new Database();
  $db = $database->connect();
  $comment = new Comment($db);

  // get request id from URL
  $comment->requestId = isset($_GET['requestId']) ? $_GET['requestId'] : die();

  // comments lookup query per request id
  $result = $comment->read();

  $count = $result->rowCount();

  // check if any comments
  if($count > 0) {
    $commentArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $commentElement = array(
        'id' => $id,
        'requestId' => $requestId,
        'authorId' => $authorId,
        'comment' => $comment,
        'createdOn' => $createdOn
      );

      array_push($commentArr, $commentElement);
    }

    http_response_code(200);
    echo json_encode($commentArr);

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No attachments found')
    );
  }