<?php
  include '../token/check_token.php';
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Request.php';

  // Instantiate DB and Request objects
  $database = new Database();
  $db = $database->connect();
  $request = new Request($db);

  $request->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Update request
  if($request->toggleActive(1)) {
    echo json_encode(
      array('message' => 'Request Reopened')
    );
  } else {
    echo json_encode(
      array('message' => 'Request Not Reopened')
    );
  }