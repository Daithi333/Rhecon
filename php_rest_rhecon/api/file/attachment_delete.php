<?php
  include_once '../../utility/Utility.php';

  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');

  $relativePath = "../..";
  $rootDir = "http://" . $_SERVER['SERVER_NAME'] . '/php_rest_rhecon';
  $targetDir = "/files/request_attachments/";
  $targetFile = $relativePath . $targetDir . $fileName;

  $fileToDelete = $_GET['file'];
  if (is_file($fileToDelete)){
    echo (unlink($fileToDelete) ? "File Deleted" : "Problem deleting file");
  }