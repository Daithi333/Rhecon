<?php
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

        // http_response_code(401);
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
      // http_response_code(401);
      echo json_encode(
        array(
          "message" => "Access denied.",
          "error" => $ex->getMessage()
        )
      );
      exit();
    }
    
  } else {
    // http_response_code(401);
    echo json_encode(
      array("message" => "Access denied.")
    );
    exit();
  }
