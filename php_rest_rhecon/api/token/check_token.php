<?php
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    exit();
  }

  include_once '../../config/secure.php';
  include_once '../../utility/JWT.php';

  $headers = apache_request_headers();
  if (isset($headers['Authorization'])) {
    $arr = explode(' ', $headers['Authorization']);
    $token = $arr[1];
  }
    
  if ($token) {
    try {
      $decoded = JWT::decode($token, $secret, array('HS256'));
      
      if($decoded->exp < time()) {

        http_response_code(401);
        echo json_encode(
          array(
            "message" => "Access denied."
          )
        );
        exit();
        
      } else {
        // token validated
        return;
      }
      
    } catch (Exception $ex) {
      http_response_code(401);
      echo json_encode(
        array(
          "message" => "Access denied.",
          "error" => $ex->getMessage()
        )
      );
      exit();
    }
    
  } else {
    http_response_code(401);
    echo json_encode(
      array("message" => "Access denied.")
    );
    exit();
  }
