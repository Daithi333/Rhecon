<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header("Access-Control-Max-Age: 604800");
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../config/secure.php';
  include_once '../../utility/JWT.php';
  
  // Instantiate DB object
  $database = new Database();
  $db = $database->connect();  

  // get posted data
  $data = json_decode(file_get_contents("php://input"));

  $token = isset($data->token) ? $data->token : '';

  if (!$token) {

    // https://stackoverflow.com/questions/2902621/fetching-custom-authorization-header-from-incoming-php-request
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
      $arr = explode(' ', $headers['Authorization']);
      $token = $arr[1];
    }
  }

  if ($token) {
    try {
      $decoded = JWT::decode($token, $secret, array('HS256'));

      http_response_code(200);
  
      echo json_encode(array(
        "message" => "Access granted.",
        "data" => $decoded->data
      ));

    } catch (Exception $ex) {

      http_response_code(401);

      echo json_encode(array(
        "message" => "Access denied.",
        "error" => $ex->getMessage()
      ));
    }

  } else {
    http_response_code(401);

      echo json_encode(
        array(
          "message" => "Access denied."
        )
      );
  }
