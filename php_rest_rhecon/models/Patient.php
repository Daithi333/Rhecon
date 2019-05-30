<?php
  class Patient {
    private $conn;
    private $table = 'Rhecon_Patient';

    // Patient properties
    public $id;
    public $firstName;
    public $lastName;
    public $dob;
    public $notes;
    public $portraitUrl;
    public $userId;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve all patient records for a particular user id
     */
    public function read() {
      $query = 'SELECT p.id, p.firstName, p.lastName, p.dob, p.notes, p.portraitUrl, p.userId
                FROM ' . $this->table . ' p
                WHERE p.userId = :userId
                ORDER BY p.firstName DESC';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve a single patient record by id for a particular user id
     */
    public function readSingle() {
      $query = 'SELECT p.id, p.firstName, p.lastName, p.dob, p.notes, p.portraitUrl, p.userId
                FROM ' . $this->table . ' p
                WHERE p.id = :id
                AND p.userId = :userId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);
      $stmt->bindParam(':id', $this->id);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      // set single patient properties
      $this->firstName = $row['firstName'];
      $this->lastName = $row['lastName'];
      $this->dob = $row['dob'];
      $this->notes = $row['notes'];
      $this->portraitUrl = $row['portraitUrl'];
    }

    /**
     * Function to add a new patient record
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                firstName = :firstName,
                lastName = :lastName,
                dob = :dob,
                notes = :notes,
                portraitUrl = :portraitUrl,
                userId = :userId';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->firstName = $this->sanitise_input($this->firstName);
      $this->lastName = $this->sanitise_input($this->lastName);
      $this->dob = $this->sanitise_input($this->dob);
      $this->notes = $this->sanitise_input($this->notes);
      $this->portraitUrl = $this->sanitise_input($this->portraitUrl);
      $this->userId = $this->sanitise_input($this->userId);

      // bind named params
      $stmt->bindParam(':firstName', $this->firstName);
      $stmt->bindParam(':lastName', $this->lastName);
      $stmt->bindParam(':dob', $this->dob);
      $stmt->bindParam(':notes', $this->notes);
      $stmt->bindParam(':portraitUrl', $this->portraitUrl);
      $stmt->bindParam(':userId', $this->userId);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to update a single patient record
     */
    public function update() {
      $query = 'UPDATE ' . $this->table . '
                SET
                  firstName = :firstName,
                  lastName = :lastName,
                  dob = :dob,
                  notes = :notes,
                  portraitUrl = :portraitUrl,
                  userId = :userId
                WHERE
                  id = :id';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = $this->sanitise_input($this->id);
      $this->firstName = $this->sanitise_input($this->firstName);
      $this->lastName = $this->sanitise_input($this->lastName);
      $this->dob = $this->sanitise_input($this->dob);
      $this->notes = $this->sanitise_input($this->notes);
      $this->portraitUrl = $this->sanitise_input($this->portraitUrl);
      $this->userId = $this->sanitise_input($this->userId);

      // bind data
      $stmt->bindParam(':id', $this->id);
      $stmt->bindParam(':firstName', $this->firstName);
      $stmt->bindParam(':lastName', $this->lastName);
      $stmt->bindParam(':dob', $this->dob);
      $stmt->bindParam(':notes', $this->notes);
      $stmt->bindParam(':portraitUrl', $this->portraitUrl);
      $stmt->bindParam(':userId', $this->userId);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to delete a single patient record
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