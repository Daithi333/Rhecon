<?php
  include_once '../../utility/Utility.php';

  class User {
    private $conn;
    private $table = 'Rhecon_User';

    // User properties
    public $id;
    public $titleId;
    public $firstName;
    public $lastName;
    public $userTypeId;
    public $specialismId;
    public $email;
    public $password;
    public $portraitUrl;

    // Constructor with DB arg
    public function __construct($db) {
      $this->conn = $db;
    }

    /**
     * Function to create new user record
     */
    public function create() {
      $query = 'INSERT INTO ' . $this->table . '
                SET
                titleId = :titleId,
                firstName = :firstName,
                lastName = :lastName,
                userTypeId = :userTypeId,
                specialismId = :specialismId,
                email = :email,
                password = :password';

      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->titleId = Utility::sanitise_input($this->titleId);
      $this->firstName = Utility::sanitise_input($this->firstName);
      $this->lastName = Utility::sanitise_input($this->lastName);
      $this->userTypeId = Utility::sanitise_input($this->userTypeId);
      $this->specialismId = Utility::sanitise_input($this->specialismId);
      $this->email = Utility::sanitise_input($this->email);
      $this->password = Utility::sanitise_input($this->password);

      // bind named params
      $stmt->bindParam(':titleId', $this->titleId);
      $stmt->bindParam(':firstName', $this->firstName);
      $stmt->bindParam(':lastName', $this->lastName);
      $stmt->bindParam(':userTypeId', $this->userTypeId);
      $stmt->bindParam(':specialismId', $this->specialismId);
      $stmt->bindParam(':email', $this->email);
      $stmt->bindParam(':password', $this->password);

      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
        return false;
      }

    /**
     * Function to retrieve a single user record by email address and passowrd (login)
     */
    public function readSingle() {
      $query = 'SELECT u.id, u.userTypeId, u.password
                FROM ' . $this->table . ' u
                WHERE u.email = :email';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':email', $this->email);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set single user properties
        $this->id = $row['id'];
        $this->userTypeId = $row['userTypeId'];
        $this->password = $row['password'];

        return true;
      }

      return false;
    }

    /**
     * Function to retrieve a single contact record by id for a particular user id
     */
    public function readProfile() {
      $query = 'SELECT u.id, u.titleId, u.firstName, u.lastName,
                u.specialismId, u.portraitUrl, u.bio
                FROM ' . $this->table . ' u
                WHERE u.id = :id';

      $stmt = $this->conn->prepare($query);

      $stmt->bindParam(':id', $this->id);

      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        // set contact properties
        $this->titleId = $row['titleId'];
        $this->firstName = $row['firstName'];
        $this->lastName = $row['lastName'];
        $this->specialismId = $row['specialismId'];
        $this->portraitUrl = $row['portraitUrl'];
        $this->bio = $row['bio'];

        return true;
      }

      return false;
    }

    /**
     * Function to update a single user profile
     */
    public function update() {
      $query = 'UPDATE ' . $this->table . '
                SET
                  titleId = :titleId,
                  firstName = :firstName,
                  lastName = :lastName,
                  specialismId = :specialismId,
                  portraitUrl = :portraitUrl,
                  bio = :bio
                WHERE
                  id = :id';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = Utility::sanitise_input($this->id);
      $this->titleId = Utility::sanitise_input($this->titleId);
      $this->firstName = Utility::sanitise_input($this->firstName);
      $this->lastName = Utility::sanitise_input($this->lastName);
      $this->specialismId = Utility::sanitise_input($this->specialismId);
      $this->portraitUrl = Utility::sanitise_input($this->portraitUrl);
      $this->bio = Utility::sanitise_input($this->bio);

      // bind data
      $stmt->bindParam(':id', $this->id);
      $stmt->bindParam(':titleId', $this->titleId);
      $stmt->bindParam(':firstName', $this->firstName);
      $stmt->bindParam(':lastName', $this->lastName);
      $stmt->bindParam(':specialismId', $this->specialismId);
      $stmt->bindParam(':portraitUrl', $this->portraitUrl);
      $stmt->bindParam(':bio', $this->bio);
      
      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    /**
     * Function to update a single user password
     */
    public function updatePassword() {
      $query = 'UPDATE ' . $this->table . '
                SET password = :password
                WHERE id = :id';
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Sanitise data
      $this->id = Utility::sanitise_input($this->id);
      $this->password = Utility::sanitise_input($this->password);

      // bind data
      $stmt->bindParam(':id', $this->id);
      $stmt->bindParam(':password', $this->password);
      
      // Execute query
      if($stmt->execute()) {
        return true;
      }

      // output msg if error
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

  }
