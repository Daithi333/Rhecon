<?php
  include_once '../../utility/Utility.php';

  class Comment {
    private $conn;
    private $table = 'Rhecon_Comment';

    // Comment properties
    public $id;
    public $requestId;
    public $authorId;
    public $comment;
    public $createdOn;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve all comments for a particular request
     */
    public function read() {
      $query = 'SELECT c.id, c.requestId, c.authorId, c.comment, c.createdOn
                FROM ' . $this->table . ' c
                WHERE c.requestId = :requestId
                ORDER BY c.createdOn ASC';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':requestId', $this->requestId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to add a new comment
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                requestId = :requestId,
                authorId = :authorId,
                comment = :comment';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->requestId = Utility::sanitise_input($this->requestId);
      $this->authorId = Utility::sanitise_input($this->authorId);
      $this->comment = Utility::sanitise_input($this->comment);;

      // bind named params
      $stmt->bindParam(':requestId', $this->requestId);
      $stmt->bindParam(':authorId', $this->authorId);
      $stmt->bindParam(':comment', $this->comment);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to delete a single comment
     */
    public function delete() {
      $query = 'DELETE FROM ' . $this->table . '
                WHERE id = :id';

      // prep statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = Utility::sanitise_input($this->id);

      // Bind data
      $stmt->bindParam(':id', $this->id);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

  }