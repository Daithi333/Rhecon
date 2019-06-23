<?php
  include_once '../../utility/Utility.php';

  class Group {
    private $conn;
    private $table = 'Rhecon_Group';
    private $membershipTable = 'Rhecon_Membership';

    // Group properties
    public $id;
    public $contactId;
    public $groupId;
    public $groupName;
    public $requestingUserId;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve groups and membership based on userId
     */
    public function read() {
      $memberOfQuery = 'SELECT n.groupId FROM ' . $this->membershipTable . ' n
                        WHERE userId = :userId';

      $query = 'SELECT m.id, m.userId, m.groupId, g.groupName
                FROM ' . $this->membershipTable . ' m
                LEFT JOIN ' . $this->table . ' g
                ON m.groupId=g.id
                WHERE groupId IN (' . $memberOfQuery . ')
                AND userId != :userId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->requestingUserId);

      $stmt->execute();

      return $stmt;
    }

  }