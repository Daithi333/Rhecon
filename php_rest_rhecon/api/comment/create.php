<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Comment.php';

  // Instantiate DB and Comment objects
  $database = new Database();
  $db = $database->connect();
  $comment = new Comment($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign comment properties from the decoded data
    $comment->requestId = $data->requestId;
    $comment->authorId = $data->authorId;
    $comment->comment = $data->comment;

    // Create comment on db. Retrieve and return the db id if successful
    if($comment->create()) {
      $uniqueId = $db->lastInsertId();
      echo json_encode(
        array('dbId' => $uniqueId)
      );
    } else {
      echo json_encode(
        array('message' => 'Comment Not Added')
      );
    }
  }