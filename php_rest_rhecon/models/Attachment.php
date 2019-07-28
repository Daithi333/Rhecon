<?php
  include_once '../../utility/Utility.php';

  class Attachment {
    private $conn;
    private $table = 'Rhecon_Attachment';

    // Attachment properties
    public $id;
    public $requestId;
    public $attachmentUrl;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to retrieve all attachments for a particular request
     */
    public function read() {
      $query = 'SELECT a.id, a.requestId, a.attachmentUrl
                FROM ' . $this->table . ' a
                WHERE a.requestId = :requestId';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':requestId', $this->requestId);

      $stmt->execute();

      return $stmt;
    }

    /**
     * Function to retrieve a single attachment by request id and its Url string
     */
    public function readSingle() {
      $query = 'SELECT a.id, a.requestId, a.attachmentUrl
                FROM ' . $this->table . ' a
                WHERE a.requestId = :requestId
                AND a.attachmentUrl = :attachmentUrl ';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':requestId', $this->requestId);
      $stmt->bindParam(':attachmentUrl', $this->attachmentUrl);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set single attachment properties
        $this->id = $row['id'];

        return true;
      }

      return false;
    }

    /**
     * Function to add a new attachment
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                requestId = :requestId,
                attachmentUrl = :attachmentUrl';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->requestId = Utility::sanitise_input($this->requestId);
      $this->attachmentUrl = Utility::sanitise_input($this->attachmentUrl);;

      // bind named params
      $stmt->bindParam(':requestId', $this->requestId);
      $stmt->bindParam(':attachmentUrl', $this->attachmentUrl);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to delete a single attachment
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