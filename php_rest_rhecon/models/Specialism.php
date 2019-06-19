<?php
  include_once '../../utility/Utility.php';

  class Specialism {
    private $conn;
    private $table = 'Rhecon_Specialism';

    // Title properties
    public $id;
    public $specialism;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve titles
     */
    public function read() {
      $query = 'SELECT s.id, s.specialism
                FROM ' . $this->table . ' s
                ORDER BY s.specialism ASC';

      $stmt = $this->conn->prepare($query);

      $stmt->execute();

      return $stmt;
    }

  }