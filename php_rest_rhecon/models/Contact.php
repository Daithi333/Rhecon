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
    public $id;
    public $title;
    public $firstName;
    public $lastName;
    public $specialism;
    public $email;
    public $portraitUrl;
    public $bio;
    public $userId;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve members of the same groups as the user id passed in.
     */
    public function read() {
      // retrieve groups ids which user is a member
      $groupsQuery = 'SELECT n.groupId
                      FROM ' . $this->membershipTable . ' n
                      WHERE n.userId = :userId';

      $query = 'SELECT u.id, t.title, u.firstName, u.lastName,
                 s.specialism, u.email, u.portraitUrl, u.bio
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
                AND m.userId != :userId
                GROUP BY u.id';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve a single contact by id
     */
    public function readSingle() {
      // retrieve groups ids which user is a member
      $groupsQuery = 'SELECT n.groupId
                      FROM ' . $this->membershipTable . ' n
                      WHERE n.userId = :userId';

      $query = 'SELECT u.id, t.title, u.firstName, u.lastName,
                s.specialism, u.email, u.portraitUrl, u.bio
                FROM ' . $this->membershipTable . ' m
                LEFT JOIN ' . $this->userTable  . ' u
                ON u.id = m.userId
                LEFT JOIN ' . $this->titleTable  . ' t
                ON t.id = u.titleId
                LEFT JOIN ' . $this->specialismTable  . ' s
                ON s.id=u.specialismId
                WHERE m.groupId
                IN (' . $groupsQuery . ')
                AND m.userId = :id
                LIMIT 1';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':userId', $this->userId);
      $stmt->bindParam(':id', $this->id);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set contact properties
        $this->title = $row['title'];
        $this->firstName = $row['firstName'];
        $this->lastName = $row['lastName'];
        $this->specialism = $row['specialism'];
        $this->email = $row['email'];
        $this->portraitUrl = $row['portraitUrl'];
        $this->bio = $row['bio'];

        return true;
      }

      return false;
    }

  }