<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: GET');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization');

  include_once '../../config/Database.php';
  include_once '../../config/secure.php';
  include_once '../../models/Patient.php';
  include_once '../../utility/JWT.php';

  // Instantiate DB and Patient objects
  $database = new Database();
  $db = $database->connect();
  $patient = new Patient($db);

  // retrieve auth token from headers
  $headers = apache_request_headers();
  if (isset($headers['Authorization'])) {
    $arr = explode(' ', $headers['Authorization']);
    $token = $arr[1];
  }

  if ($token) {
    try {
      $decoded = JWT::decode($token, $secret, array('HS256'));

      // get user id from URL
      $patient->userId = isset($_GET['userId']) ? $_GET['userId'] : die();

      // patient lookup query per user id
      $result = $patient->read();

      $count = $result->rowCount();

      // check if any patients
      if($count > 0) {
        $patientArr = array();

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
          extract($row);

          $patientElement = array(
            'id' => $id,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'dob' => $dob,
            'notes' => $notes,
            'portraitUrl' => $portraitUrl,
            'userId' => $userId
          );

          array_push($patientArr, $patientElement);
        }

        http_response_code(200);
        // output as JSON
        echo json_encode($patientArr);

      } else {
        http_response_code(204);
        echo json_encode(
          array('message' => 'No patients found')
        );
      }

    } catch (Exception $ex) {
      http_response_code(401);
      echo json_encode(
        array(
          "message" => "Access denied",
          "error" => $ex->getMessage()
        )
      );
    }

  } else {
    // TODO - causing CORS OPTIONS error even though token valid and else should not be activated
    //http_response_code(401);
    echo json_encode(
      array("message" => "Access denied")
    );
  }
