<?php
  include_once '../../utility/Utility.php';

  class Group {
    private $conn;
    private $table = 'Rhecon_Group';
    private $membershipTable = 'Rhecon_Membership';

    // Group properties
    public $id;
    // public $contactId;
    public $groupName;
    public $imageUrl;
    public $userId;
    public $groupId;
    
    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve groups and membership based on userId
     */
    public function read() {
      // $memberOfQuery = 'SELECT n.groupId FROM ' . $this->membershipTable . ' n
      //                   WHERE userId = :userId';

      // $query = 'SELECT m.id, m.userId, m.groupId, g.groupName g.imageUrl
      //           FROM ' . $this->membershipTable . ' m
      //           LEFT JOIN ' . $this->table . ' g
      //           ON m.groupId=g.id
      //           WHERE groupId IN (' . $memberOfQuery . ')
      //           AND userId != :userId';

      $query = 'SELECT g.id, g.groupName, g.imageUrl
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

      $query = 'SELECT m.userId
                FROM ' . $this->membershipTable . ' m
                WHERE groupId = :groupId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':groupId', $this->groupId);

      $stmt->execute();

      return $stmt;
    }

  }