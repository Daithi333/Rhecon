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
  include_once '../../models/User.php';
  

  // Instantiate DB and User objects
  $database = new Database();
  $db = $database->connect();
  $user = new User($db);

  // random data for temp password
  $strings = array('wander', 'spanner', 'marble', 'tablet', 'pepper', 'legend', 'bridge', 'reward', 'valley', 'island', 'winter', 'voyage');
  $rand = rand(10000, 99999);
  $tempPassword = $strings[array_rand($strings)] . $rand;

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign user email from decoded data
    $user->email = $data->email;

    $result = $user->readSingle();

    // check email is registered
    if (!$result) {
      http_response_code(400);
      exit('Email not registered');
    }

    $user->password = password_hash($tempPassword, PASSWORD_DEFAULT);

    // prepare and send email
    $body = "Hello,\n\n
    A password reset has been requested for your account on Rhecon (Remote Healthcare Consultation).\n\n
    Below is your temporary password valid for 24 hours, you will be required to change it upon logging in:\n\n
    " . $tempPassword . "\n\n\n
    Kind Regards,\n
    The Rhecon App";
    
    $headers = "From: Rhecon" . "\r\n";

    mail($user->email, "Remote Healthcare Consultation Password Reset", $body, $headers);

    // change user password to the temporary one
    if ($user->updatePassword()) {
      http_response_code(200);
      echo json_encode(
        array('message' => 'Password changed')
      );
      
    } else {
      http_response_code(500);
      echo json_encode(array
        ('message' => 'Password not changed')
      );
    }

  }