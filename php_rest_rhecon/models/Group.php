<?php
  include_once '../../utility/Utility.php';

  class Group {
    private $conn;
    private $table = 'Rhecon_Group';
    private $membershipTable = 'Rhecon_Membership';

    // Group properties
    public $id;
    public $groupName;
    public $imageUrl;
    public $isAdmin;
    public $userId;
    public $groupId; // for the membership table join
    
    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve groups and membership based on userId
     */
    public function read() {

      $query = 'SELECT g.id, g.groupName, g.imageUrl, m.isAdmin
                FROM ' . $this->membershipTable . ' m
                LEFT JOIN ' . $this->table . ' g
                ON m.groupId=g.id
                WHERE userId = :userId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve membership of a group based on groupId
     */
    public function readMembership() {

      $query = 'SELECT m.userId, m.isAdmin
                FROM ' . $this->membershipTable . ' m
                WHERE groupId = :groupId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':groupId', $this->groupId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve a single group record by id
     */
    public function readSingle() {
      $query = 'SELECT g.groupName, g.imageUrl, m.isAdmin
                FROM ' . $this->table . ' g
                LEFT JOIN ' . $this->membershipTable . ' m
                ON g.id=m.groupId
                WHERE g.id = :id
                AND m.userId = :userId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':id', $this->id);
      $stmt->bindParam(':userId', $this->userId);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set single group properties
        $this->groupName = $row['groupName'];
        $this->imageUrl = $row['imageUrl'];
        $this->isAdmin = $row['isAdmin'];

        return true;
      }

      return false;
    }

    /**
     * Function to add a new group record
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                groupName = :groupName,
                imageUrl = :imageUrl';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->groupName = Utility::sanitise_input($this->groupName);
      $this->imageUrl = Utility::sanitise_input($this->imageUrl);

      // bind named params
      $stmt->bindParam(':groupName', $this->groupName);
      $stmt->bindParam(':imageUrl', $this->imageUrl);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Creates Admin membership record
     */
    public function createMembership($tinyInt) {
      $query = 'INSERT INTO ' . $this->membershipTable . '
                SET
                userId = :userId,
                groupId = :groupId,
                isAdmin = ' . $tinyInt . ' ';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->userId = Utility::sanitise_input($this->userId);
      $this->groupId = Utility::sanitise_input($this->groupId);

      // bind named params
      $stmt->bindParam(':userId', $this->userId);
      $stmt->bindParam(':groupId', $this->groupId);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to update a single group record
     */
    public function update() {
      $query = 'UPDATE ' . $this->table . '
                SET
                  groupName = :groupName,
                  imageUrl = :imageUrl
                WHERE
                  id = :id';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = Utility::sanitise_input($this->id);
      $this->groupName = Utility::sanitise_input($this->groupName);
      $this->imageUrl = Utility::sanitise_input($this->imageUrl);

      // bind data
      $stmt->bindParam(':id', $this->id);
      $stmt->bindParam(':groupName', $this->groupName);
      $stmt->bindParam(':imageUrl', $this->imageUrl);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

  }