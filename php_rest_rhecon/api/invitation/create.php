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

    $body = "Hello,\n\n
    You have recieved an invitation from the Rhecon app to join the following group:\n\n
    " . $invitation->groupName . "\n\n\n
    Please register on the app and use the following code when requested to join the group:\n\n
    " . $invitation->inviteCode . "\n\n
    This code will be valid for 72 hours from when this email was sent, after which a new invitation will need to be sent.\n\n\n
    Regards,\n
    The Rhecon Team";
    
    $headers = "From: Rhecon" . "\r\n";

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
