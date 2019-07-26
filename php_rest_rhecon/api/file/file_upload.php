<?php
  include_once '../../utility/Utility.php';

  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: GET, POST');

  $relativePath = "../..";
  $rootDir = "http://" . $_SERVER['SERVER_NAME'] . '/php_rest_rhecon';

  $fileName = basename($_FILES['fileUpload']['name']);
  $temp = $_FILES['fileUpload']['tmp_name'];
  $rand = rand(100000, 10000000);
  $fileName = $rand . $fileName;
  $targetFile = $relativePath . $targetDir . $fileName;

  $fileType = pathinfo($targetFile, PATHINFO_EXTENSION);

  // from the blob constructor which only sends jpeg
  if (!$fileType) {
    $fileType = 'jpeg';
  }
 
  $uploadOk = true;
  $errorMsg = 'Problem uploading file';

  // Check if file already exists
  if (file_exists($targetFile)) {
    $errorMsg = 'File already exists';
    $uploadOk = false;
  }

  // Check file size < Max allowed
  if ($_FILES['fileUpload']['size'] > $maxSize) {
    $errorMsg = 'File size too large';
    $uploadOk = false;
  }

  if ( (!in_array(strtolower($fileType), $validExt)) ) {
    $errorMsg = 'Unsupported Format';
    $uploadOk = false;
  }

  // Check if uploadOk after the checks..
  if (!$uploadOk) {
    http_response_code(400);
    echo json_encode(
      array(
        'message' => $errorMsg
      )
    );

  } else {  
    if (move_uploaded_file($temp, $targetFile)) {
      echo json_encode(
        array(
          'fileUrl' => $rootDir . $targetDir . $fileName,
          'filePath' => $targetDir . $fileName
        )
      );
    } else {
      http_response_code(500);
      echo json_encode(
        array(
          'message' => $errorMsg
        )
      );
    }

  }