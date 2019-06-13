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
  $targetDir = "/files/patient_img/";
  $rootDir = "http://" . $_SERVER['SERVER_NAME'] . '/php_rest_rhecon';
  
  // for multiple file upload
  // $url = $_SERVER['REQUEST_URI'];
  // $parts = explode('/', $url);
  
  // for ($i = 0; $i < count($parts) - 1; $i++) {
  //   $rootDir .= $parts[$i] . "/";
  // }
  // echo $rootDir;

  $fileName = basename($_FILES['fileUpload']['name']);
  $temp = $_FILES['fileUpload']['tmp_name'];
  $rand = rand(10, 1000000);
  $fileName = $rand . $fileName;
  $targetFile = $relativePath . $targetDir . $fileName;

  $imageFileType = pathinfo($targetFile, PATHINFO_EXTENSION);
  $validExt = array('gif', 'png', 'jpg', 'jpeg', 'tiff', 'bmp');

  $uploadOk = true;
  $errorMsg = 'Somethng went wrong';

  // check if actiually an image
  if (isset($_POST['submit'])) {
    $check = getimagesize($temp);
    if ($check !== false) {
      echo "File is an image: " . $check['mime'];
      $uploadOk = true;
    } else {
      $errorMsg = 'File is not an image';
      $uploadOk = false;
    }
  }

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