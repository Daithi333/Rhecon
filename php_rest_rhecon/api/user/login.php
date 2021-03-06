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
  
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../config/secure.php';
  include_once '../../utility/JWT.php';
  include_once '../../models/User.php';
  

  // Instantiate DB and User objects
  $database = new Database();
  $db = $database->connect();
  $user = new User($db);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign user properties from the decoded data
    $user->email = $data->email;
    $enteredPassword = $data->password;

    // some data checks in case user bypassed on front-end
    if ( empty($user->email) || (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) ) {
      http_response_code(400);
      exit('Invalid email');
    }

    // Check if user is on db
    if($user->readSingle()) {

      // verify entered password against hashed password from DB
      if (password_verify($enteredPassword, $user->password)) {
        
        // Create token if successful 
        $issuer = $_SERVER['SERVER_NAME'];
        $audience = 'Rhecon';
        $issuedAt = time();
        $notBefore = $issuedAt + 10;
        $expiresAt = $issuedAt + (3600 * 2); // 2 hour token
        $tokenData = array(
          'iss' => $issuer,
          'aud' => $audience,
          'iat' => $issuedAt,
          'nbf' => $notBefore,
          'exp' => $expiresAt,
          'data' => array (
            'id' => $user->id,
            'userTypeId' => $user->userTypeId,
            'email' => $user->email,
          )
        );

        http_response_code(200);

        $token = JWT::encode($tokenData, $secret);

        echo json_encode(
          array(
            'message' => 'Successful Login',
            'token' => $token,
            'email' => $user->email,
            'userId' => $user->id,
            'userTypeId' => $user->userTypeId,
            'expiresAt' => $expiresAt
          )
        );

      } else {
        http_response_code(400);
        echo json_encode(
          array('message' => 'Password incorrect')
        );
      }
     
    } else {
      http_response_code(401);
      echo json_encode(
        array('message' => 'User not found')
      );
    }
  }
  