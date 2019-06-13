<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request data objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  $request->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Delete request
  if($request->delete()) {
    echo json_encode(
      array('message' => 'Request Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Request Not Deleted')
    );
  }
  