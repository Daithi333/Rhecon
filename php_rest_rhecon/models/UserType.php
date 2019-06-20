<?php
  include_once '../../utility/Utility.php';

  class UserType {
    private $conn;
    private $table = 'Rhecon_UserType';

    // User Type properties
    public $id;
    public $userType;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve user types
     */
    public function read() {
      $query = 'SELECT u.id, u.userType
                FROM ' . $this->table . ' u
                WHERE u.userType != "Admin" ';

      $stmt = $this->conn->prepare($query);

      $stmt->execute();

      return $stmt;
    }

  }