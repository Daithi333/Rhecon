<?php

  // create error with custom message
  function apiError($message) {
      
    $error = array(
      'type' => 'error',
      'error' => true,
      'message' => $message
    );
    echo json_encode($error);
  }

  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: GET, POST');

  $relativePath = "../..";
  $rootDir = "http://" . $_SERVER['SERVER_NAME'] . '/php_rest_rhecon';
  $targetDir = "/files/group_img/";

  $fileName = basename($_FILES['fileUpload']['name']);
  $temp = $_FILES['fileUpload']['tmp_name'];
  $rand = rand(10, 1000000);
  $fileName = $rand . $fileName;
  $targetFile = $relativePath . $targetDir . $fileName;

  $imageFileType = pathinfo($targetFile, PATHINFO_EXTENSION);
  $validExt = array('gif', 'png', 'jpg', 'jpeg', 'tiff', 'bmp');

  $uploadOk = true;
  $errorMsg = 'Something went wrong';

  // Check if file already exists
  if (file_exists($targetFile)) {
    $errorMsg = 'File already exists';
    $uploadOk = false;
  }

  // Check file size
  if ($_FILES['fileUpload']['size'] > 2000000) {
    $errorMsg = 'File size is too large';
    $uploadOk = false;
  }

  // if ( (!in_array(strtolower($imageFileType), $validExt)) ) {
  //   $errorMsg = 'Images must be in one of the following formats: gif, png, jpg, bmp, tiff';
  //   $uploadOk = false;
  // }

  // Check if uploadOk after the checks..
  if (!$uploadOk) {
    apiError($errorMsg);

  } else {  
    if (move_uploaded_file($temp, $targetFile)) {
      echo json_encode(
        array(
          'fileUrl' => $rootDir . $targetDir . $fileName,
          'filePath' => $targetDir . $fileName
        )
      );
    } else {
      apiError('Problem uploading file');
    }

  }