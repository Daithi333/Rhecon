<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

  $relativePath = "../..";
  $rootDir = "http://" . $_SERVER['SERVER_NAME'] . '/php_rest_rhecon';
  $targetDir = "/files/request_attachments/";

  // get raw data
  $data = json_decode(file_get_contents("php://input"));

  // assign file Url decoded data
  $fileUrl = $data->fileUrl;
  $filename = basename($fileUrl);
  $filepath = $relativePath . $targetDir . $filename;

  if(!file_exists($filepath)) {
    die('File not found');

  } else {
    header("Content-Description: File Transfer");
    header('Content-Type: application/octet-stream');
    header("Content-Transfer-Encoding: Binary");
    header('Content-Disposition: attachment; filename="' . $filename . '" ');

    readfile($filepath);
  }
  