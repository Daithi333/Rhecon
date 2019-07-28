<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Invitation.php';

  // Instantiate DB and Invitation objects
  $database = new Database();
  $db = $database->connect();
  $invitation = new Invitation($db);

  // token and expiry
  $token = bin2hex(random_bytes(64));
  $expiry = time() + (3600 * 24 * 3);

  // get the raw data
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data)) {
    // assign Invitation properties from the decoded data
    $invitation->groupId = $data->groupId;
    $invitation->inviteCode = $token;
    $invitation->expiresOn = $expiry;
    $invitation->recipient = $data->recipient;
    $invitation->groupName = $data->groupName;
    $sender = $data->sender;
    $message = $data->message;

    $body = "Hello,\n\n
    You have recieved an invitation to join a Rhecon group (" . $invitation->groupName . ") with the following message:\n\n
    " . $message . "\n\n\n
    Please register on the app if not already and use the following code to join the group:\n\n
    " . $invitation->inviteCode . "\n\n
    This code will be valid for 72 hours, after which a new invitation will be needed.\n\n\n
    Kind Regards,\n
    The Rhecon App";
    
    $headers = "From: Rhecon" . "\r\n" . 
                "Cc: " . $sender .  "\r\n";

    // Create Invite on db. Retrieve and return the db id if successful
    if($invitation->create()) {
      $uniqueId = $db->lastInsertId();

      // send email
      mail($invitation->recipient,"Remote Healthcare Consultation Group Invitation", $body, $headers);

      echo json_encode(
        array(
          'message' => 'Email invitation sent',
          'dbId' => $uniqueId,
          // 'token' => $token,
          // 'expiresOn' => $expiry
        )
      );
      
    } else {
      echo json_encode(
        array('message' => 'Invitation Not Added')
      );
    }
  }
