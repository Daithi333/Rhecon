<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Attachment.php';

  // Instantiate DB and Patient record objects
  $database = new Database();
  $db = $database->connect();
  $attachment = new Attachment($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign patient properties from the decoded data
    $attachment->requestId = $data->requestId;
    $attachment->attachmentUrl = $data->attachmentUrl;

    // Create patient on db. Retrieve and return the db id if successful
    if($attachment->create()) {
      $uniqueId = $db->lastInsertId();
      echo json_encode(
        array('UniqueId' => $uniqueId)
      );
    } else {
      echo json_encode(
        array('message' => 'Attachments Not Added')
      );
    }
  }