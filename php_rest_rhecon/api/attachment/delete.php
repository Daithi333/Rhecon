<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Attachment.php';

  // Instantiate DB and Request data objects
  $database = new Database();
  $db = $database->connect();
  $attachment = new Attachment($db);

  $attachment->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Delete request
  if($attachment->delete()) {
    echo json_encode(
      array('message' => 'Attachment Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Attachment Not Deleted')
    );
  }
  