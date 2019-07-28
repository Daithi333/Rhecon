<?php
  include_once '../../utility/Utility.php';

  class Invitation {
    private $conn;
    private $table = 'Rhecon_Invitation';

    // Invite properties
    public $id;
    public $groupId;
    public $inviteCode;
    public $expiresOn;
    public $recipient;
    public $isRedeemed;

    // for the email invitataion
    public $groupName;
    
    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to add a new invitation
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                groupId = :groupId,
                inviteCode = :inviteCode,
                expiresOn = FROM_UNIXTIME(:expiresOn),
                recipient = :recipient';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->groupId = Utility::sanitise_input($this->groupId);
      $this->inviteCode = Utility::sanitise_input($this->inviteCode);
      $this->expiresOn = Utility::sanitise_input($this->expiresOn);
      $this->recipient = Utility::sanitise_input($this->recipient);

      // bind named params
      $stmt->bindParam(':groupId', $this->groupId);
      $stmt->bindParam(':inviteCode', $this->inviteCode);
      $stmt->bindParam(':expiresOn', $this->expiresOn);
      $stmt->bindParam(':recipient', $this->recipient);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to retrieve a single invitation by its invitation code
     */
    public function readSingle() {
      $query = 'SELECT i.id, i.groupId, i.expiresOn, i.recipient, i.isValid
                FROM ' . $this->table . ' i
                WHERE i.inviteCode = :inviteCode';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':inviteCode', $this->inviteCode);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set single invitation properties
        $this->id = $row['id'];
        $this->groupId = $row['groupId'];
        $this->expiresOn = $row['expiresOn'];
        $this->recipient = $row['recipient'];
        $this->isValid = $row['isValid'];

        return true;
      }

      return false;
    }

    /**
     * Function to invalidate a single invitation after expiry or single usage
     */
    public function invalidate() {
      $query = 'UPDATE ' . $this->table . '
                SET isValid = 0
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