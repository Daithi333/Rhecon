<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {

    $email = $data->email;
    $firstName = $data->firstName;
    $lastName = $data->lastName;
    $groupName = $data->groupName;
    $adminEmail = $data->adminEmail;
    $requesterName = $firstName . " " . $lastName;

    $body = "Hello,\n\n
    You have recieved a request from " . $requesterName . " to join " . $groupName . ".\n
    To invite them, login to the Rhecon application, navigate to the group information page and click on 'invite member'.\n
    From there, you can send them a joining code by entering their email address given below:\n\n
    " . $email . "\n\n\n
    Kind Regards,\n
    The Rhecon App";
    
    $headers = "From: Rhecon" . "\r\n";

    // send email
    if (mail($adminEmail,"Remote Helathcare Consultation - Group Join Request", $body, $headers)) {
      echo json_encode(array('message' => 'Email sent'));
    } else {
      echo json_encode(array('message' => 'Email not sent'));
    };

  }