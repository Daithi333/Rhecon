<?php
  include_once '../../utility/Utility.php';

  class Title {
    private $conn;
    private $table = 'Rhecon_Title';

    // Title properties
    public $id;
    public $title;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve titles
     */
    public function read() {
      $query = 'SELECT t.id, t.title
                FROM ' . $this->table . ' t';

      $stmt = $this->conn->prepare($query);

      $stmt->execute();

      return $stmt;
    }

  }