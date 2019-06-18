<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Contact.php';

  // Instantiate DB and Contact record objects
  $database = new Database();
  $db = $database->connect();
  $contact = new Contact($db);

  // get user id from URL
  $contact->userId = isset($_GET['userId']) ? $_GET['userId'] : die();

  // contact lookup query per user id
  $result = $contact->read();

  $count = $result->rowCount();

  // check if any contacts
  if($count > 0) {
    $contactArr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $contactElement = array(
        'groupId' => $groupId,
        'groupName' => $groupName,
        'userId' => $userId,
        'titleId' => $titleId,
        'title' => $title,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'specialismId' => $specialismId,
        'specialism' => $specialism,
        'portraitUrl' => $portraitUrl,
        'bio' => $bio
      );

      array_push($contactArr, $contactElement);
    }

    // output as JSON
    echo json_encode($contactArr);

    // } else {
    //   echo json_encode(
    //     array('message' => 'No patients found')
    //   );
  }