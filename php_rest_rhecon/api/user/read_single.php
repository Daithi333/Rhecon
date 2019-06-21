<?php
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

    // Create user on db and generate auth token
    if($user->readSingle()) {

      // verify entered password against hashed password from DB
      if (password_verify($enteredPassword, $user->password)) {
        
        // $token = bin2hex(random_bytes(64));
        $issuer = $_SERVER['SERVER_NAME'];
        $audience = 'Rhecon';
        $issuedAt = time();
        $notBefore = $issuedAt + 10;
        $expiresAt = $issuedAt + (3600 * 24 * 7);
        $token = array(
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

        $idToken = JWT::encode($token, $secret);

        echo json_encode(
          array(
            'message' => 'Success',
            'idToken' => $idToken,
            'email' => $user->email,
            'userId' => $user->id,
            'expiresAt' => $expiresAt
          )
        );

      } else {
        echo json_encode(
          array('message' => 'Password incorrect')
        );
      }
     
    } else {
      echo json_encode(
        array('message' => 'User not found')
      );
    }
  }
  