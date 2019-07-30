<?php
  include '../token/check_token.php';

  $targetDir = "/files/request_attachments/";
  $validExt = array('acc', 'avi', 'bmp', 'csv','dcm', 'dcm30', 'dicom', 'doc', 'docx', 'gif', 
  'ico', 'jpg', 'jpeg', 'm4a', 'mp3', 'mp4', 'mpeg', 'opd', 'ods', 'odt', 'oga', 'ogv', 'png', 
  'pdf',  'ppt',  'pptx', 'tif', 'tiff', 'ts', 'txt', 'wav', 'weba',  'webm', 'webp', 'xls', 'xlsx', 'zip' );
  $maxSize = 26214400;
  
  include_once 'file_upload.php';