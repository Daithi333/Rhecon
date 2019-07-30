<?php
  include '../token/check_token.php';

  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  include_once '../../config/Database.php';
  include_once '../../models/Attachment.php';

  // Instantiate DB and Attachment data objects
  $database = new Database();
  $db = $database->connect();
  $attachment = new Attachment($db);

  $attachment->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Delete attachment
  if($attachment->delete()) {
    echo json_encode(
      array('message' => 'Attachment Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Attachment Not Deleted')
    );
  }
  