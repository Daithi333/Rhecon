<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: GET');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  include_once '../../config/Database.php';
  include_once '../../models/Attachment.php';

  // Instantiate DB and Attachment data objects
  $database = new Database();
  $db = $database->connect();
  $attachment = new Attachment($db);

  // get request id and attachmentUrl from URL
  $attachment->requestId = isset($_GET['requestId']) ? $_GET['requestId'] : die();
  $attachment->attachmentUrl = isset($_GET['attachmentUrl']) ? $_GET['attachmentUrl'] : die();

  if ($attachment->readSingle()) {
    $attachmentArr = array(
      'id' => $attachment->id,
      'requestId' => $attachment->requestId,
      'attachmentUrl' => $attachment->attachmentUrl
    );

    http_response_code(200);
    print_r(json_encode($attachmentArr));  

  } else {
    http_response_code(204);
    echo json_encode(
      array('message' => 'No attachments found')
    );
  }

   
