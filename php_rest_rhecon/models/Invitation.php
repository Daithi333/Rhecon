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

    // for the email invitataion
    public $groupName;
    
    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to add a new invite record
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

  }