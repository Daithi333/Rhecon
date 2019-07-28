<?php
  include_once '../../utility/Utility.php';

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
     * Function to retrieve all active patients for a particular user id
     */
    public function read() {
      $query = 'SELECT p.id, p.firstName, p.lastName, p.dob, p.notes, p.portraitUrl, p.userId
                FROM ' . $this->table . ' p
                WHERE p.userId = :userId
                AND active = 1
                ORDER BY p.firstName ASC';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve a single patient by id for a particular user id
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

      if ($row) {
        // set single patient properties
        $this->firstName = $row['firstName'];
        $this->lastName = $row['lastName'];
        $this->dob = $row['dob'];
        $this->notes = $row['notes'];
        $this->portraitUrl = $row['portraitUrl'];

        return true;
      }

      return false;
    }

    /**
     * Function to add a new patient
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
      $this->firstName = Utility::sanitise_input($this->firstName);
      $this->lastName = Utility::sanitise_input($this->lastName);
      $this->dob = Utility::sanitise_input($this->dob);
      $this->notes = Utility::sanitise_input($this->notes);
      $this->portraitUrl = Utility::sanitise_input($this->portraitUrl);
      $this->userId = Utility::sanitise_input($this->userId);

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
     * Function to update a single patient
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
      $this->id = Utility::sanitise_input($this->id);
      $this->firstName = Utility::sanitise_input($this->firstName);
      $this->lastName = Utility::sanitise_input($this->lastName);
      $this->dob = Utility::sanitise_input($this->dob);
      $this->notes = Utility::sanitise_input($this->notes);
      $this->portraitUrl = Utility::sanitise_input($this->portraitUrl);
      $this->userId = Utility::sanitise_input($this->userId);

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
     * Function to delete a single patient
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

    /**
     * Function to close a single patient
     */
    public function closePatient() {
      $query = 'UPDATE ' . $this->table . '
                SET active = 0
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