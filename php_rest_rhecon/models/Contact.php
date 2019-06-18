<?php
  include_once '../../utility/Utility.php';

  class Contact {
    private $conn;
    private $membershipTable = 'Rhecon_Membership';
    private $groupTable = 'Rhecon_Group';
    private $userTable = 'Rhecon_User';
    private $titleTable = 'Rhecon_Title';
    private $specialismTable = 'Rhecon_Specialism';

    // Contact properties
    public $groupId;
    public $groupName;
    public $userId;
    public $titleId;
    public $title;
    public $firstName;
    public $lastName;
    public $specialismId;
    public $specialism;
    public $portraitUrl;
    public $bio;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve members of the same groups as the user id passed in.
     */
    public function read() {
      $groupsQuery = 'SELECT n.groupId
                      FROM ' . $this->membershipTable . ' n
                      WHERE n.userId = :userId';

      $query = 'SELECT m.groupId, g.groupName, m.userId, u.titleId, t.title, u.firstName,
                u.lastName, u.specialismId, s.specialism, u.portraitUrl, u.bio
                FROM ' . $this->membershipTable . ' m
                LEFT JOIN ' . $this->groupTable  . ' g
                ON g.id = m.groupId
                LEFT JOIN ' . $this->userTable  . ' u
                ON u.id = m.userId
                LEFT JOIN ' . $this->titleTable  . ' t
                ON t.id = u.titleId
                LEFT JOIN ' . $this->specialismTable  . ' s
                ON s.id=u.specialismId
                WHERE m.groupId
                IN (' . $groupsQuery . ')
                AND m.userId != :userId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);

      $stmt->execute();

      return $stmt;
    }

  }