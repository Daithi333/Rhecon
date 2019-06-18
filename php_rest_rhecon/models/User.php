<?php
  include_once '../../utility/Utility.php';

  class Patient {
    private $conn;
    private $table = 'Rhecon_User';

    // User properties
    public $id;
    public $titleId;
    public $firstName;
    public $lastName;
    public $userTypeId;
    public $specialismId;
    public $email;
    public $password;
    public $portraitUrl;
    public $bio;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve user records
     */
    public function read() {

    }

  }