<?php
  class Request {
    private $conn;
    private $table = 'Rhecon_Request';

    // Patient properties
    public $id;
    public $title;
    public $requesterId;
    public $consultantId;
    public $patientId;
    public $notes;
    public $active;
    public $createdOn;
    public $updatedOn;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve all requests for a particular requester
     */
    public function read() {
      $query = 'SELECT r.id, r.title, r.requesterId, r.consultantId, r.patientId, r.notes, r.active, r.createdOn, r.updatedOn
                FROM ' . $this->table . ' r
                WHERE r.requesterId = :requesterId
                ORDER BY r.updatedOn DESC';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':requesterId', $this->requesterId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve a single request record by id for a particular user
     */
    public function readSingle() {
      $query = 'SELECT r.id, r.title, r.requesterId, r.consultantId, r.patientId, r.notes, r.active, r.createdOn, r.updatedOn
                FROM ' . $this->table . ' r
                WHERE r.id = :id
                AND r.requesterId = :requesterId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':requesterId', $this->requesterId);
      $stmt->bindParam(':id', $this->id);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set single request properties
        $this->title = $row['title'];
        $this->consultantId = $row['consultantId'];
        $this->patientId = $row['patientId'];
        $this->notes = $row['notes'];
        $this->active = $row['active'];
        $this->createdOn = $row['createdOn'];
        $this->updatedOn = $row['updatedOn'];

        return true;
      }

      return false;
    }

    /**
     * Function to add a new request record
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                title = :title,
                requesterId = :requesterId,
                consultantId = :consultantId,
                patientId = :patientId,
                notes = :notes';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->title = $this->sanitise_input($this->title);
      $this->requesterId = $this->sanitise_input($this->requesterId);
      $this->consultantId = $this->sanitise_input($this->consultantId);
      $this->patientId = $this->sanitise_input($this->patientId);
      $this->notes = $this->sanitise_input($this->notes);

      // bind named params
      $stmt->bindParam(':title', $this->title);
      $stmt->bindParam(':requesterId', $this->requesterId);
      $stmt->bindParam(':consultantId', $this->consultantId);
      $stmt->bindParam(':patientId', $this->patientId);
      $stmt->bindParam(':notes', $this->notes);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to update the core content of a request record
     */
    public function update() {
      $query = 'UPDATE ' . $this->table . '
                SET
                  title = :title,
                  consultantId = :consultantId,
                  patientId = :patientId,
                  notes = :notes
                WHERE
                  id = :id';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = $this->sanitise_input($this->id);
      $this->title = $this->sanitise_input($this->title);
      $this->consultantId = $this->sanitise_input($this->consultantId);
      $this->patientId = $this->sanitise_input($this->patientId);
      $this->notes = $this->sanitise_input($this->notes);

      // bind data
      $stmt->bindParam(':id', $this->id);
      $stmt->bindParam(':title', $this->title);
      $stmt->bindParam(':consultantId', $this->consultantId);
      $stmt->bindParam(':patientId', $this->patientId);
      $stmt->bindParam(':notes', $this->notes);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to close a single request record
     */
    public function closeRequest() {
      $query = 'UPDATE ' . $this->table . '
                SET active = 0
                WHERE id = :id';

      // prep statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = $this->sanitise_input($this->id);

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

    /**
     * Function to delete a single request record
     */
    public function delete() {
      $query = 'DELETE FROM ' . $this->table . '
                WHERE id = :id';

      // prep statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = $this->sanitise_input($this->id);

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

    /**
     * Function to sanitise data passed in as param
     */
    private function sanitise_input($data) {
      $data = trim($data);
      $data = strip_tags($data);
      $data = htmlspecialchars($data);
      return $data;
    }
    
  }