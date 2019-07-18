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
    public $groupId; // same as id but for the membership table join
    public $newAdminId; // for admin swap
    
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
     * Function to retrieve groups and admin based on name comparison
     */
    public function search($searchedName) {

      $query = 'SELECT g.id, g.groupName, g.imageUrl, m.userId
                FROM ' . $this->membershipTable . ' m
                LEFT JOIN ' . $this->table . ' g
                ON m.groupId=g.id
                WHERE g.groupName LIKE "%' . $searchedName . '%"
                AND m.isAdmin = 1';

      $searchedName = Utility::sanitise_input($searchedName);

      $stmt = $this->conn->prepare($query);

      $stmt->execute();

      return $stmt;
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

    /**
    * Function to add admin to a single group membership
    */
    public function setAdmin() {
      $query = 'UPDATE ' . $this->membershipTable . '
                SET isAdmin = 1
                WHERE userId = :newAdminId
                AND groupId = :groupId';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->newAdminId = Utility::sanitise_input($this->newAdminId);
      $this->groupId = Utility::sanitise_input($this->groupId);

      // bind data
      $stmt->bindParam(':newAdminId', $this->newAdminId);
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
    * Function to remove admin from a single membership record
    */
    public function removeAdmin() {
      $query = 'UPDATE ' . $this->membershipTable . '
                SET isAdmin = 0
                WHERE userId = :userId
                AND groupId = :groupId';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->userId = Utility::sanitise_input($this->userId);
      $this->groupId = Utility::sanitise_input($this->groupId);

      // bind data
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
     * Function to delete a single group membership record
     */
    public function deleteMembership() {
      $query = 'DELETE FROM ' . $this->membershipTable . '
                WHERE userId = :userId
                AND groupId = :groupId';

      // prep statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->userId = Utility::sanitise_input($this->userId);
      $this->groupId = Utility::sanitise_input($this->groupId);

      // Bind data
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
     * Function to delete a single group record
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