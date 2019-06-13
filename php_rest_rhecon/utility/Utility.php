<?php
  class Utility {
    
    /**
     * Function to sanitise data passed in as param
     */
    static function sanitise_input($data) {
      $data = trim($data);
      $data = strip_tags($data);
      $data = htmlspecialchars($data);
      return $data;
    }

  }