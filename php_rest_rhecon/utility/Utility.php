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
    
    static function api_error($message) {
      
      $error = array(
        'type' => 'error',
        'error' => true,
        'message' => $message
      );
      echo json_encode($error);
    }

  }