<?php
  include '../token/check_token.php';

  $targetDir = "/files/user_img/";
  $validExt = array('bmp', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'webp');
  $maxSize = 26214400;
  
  include_once 'file_upload.php';