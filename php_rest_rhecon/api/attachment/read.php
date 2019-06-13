<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Attachment.php';

  // Instantiate DB and Patient record objects
  $database = new Database();
  $db = $database->connect();
  $attachment = new Attachment($db);

  // get request id from URL
  $attachment->requestId = isset($_GET['requestId']) ? $_GET['requestId'] : die();

  // attachments lookup query per request id
  $result = $attachment->read();

  $count = $result->rowCount();

  // check if any attachments
  if($count > 0) {
    $attachmentArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $attachmentElement = array(
        'id' => $id,
        'requestId' => $requestId,
        'attachmentUrl' => $attachmentUrl
      );

      array_push($attachmentArr, $attachmentElement);
    }

    // output as JSON
    echo json_encode($attachmentArr);

  // } else {
  //   echo json_encode(
  //     array('message' => 'No attachments found')
  //   );
  }